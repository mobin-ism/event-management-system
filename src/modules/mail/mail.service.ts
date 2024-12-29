import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { Worker } from 'worker_threads'
import { join } from 'path';
@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name)
    @OnEvent('registration-confirmation')
    async sendEmail(templateName: string, userData: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const worker = new Worker(join(__dirname, 'email.worker.js'), {
                workerData: { templateName, userData }
            })

            worker.on('message', (message) => {
                if (message.success) {
                    this.logger.log(
                        `Email sent successfully: ${message.messageId}`
                    )
                    resolve()
                } else {
                    this.logger.error(`Email sending failed: ${message.error}`)
                    reject(new Error(message.error))
                }
            })

            worker.on('error', reject)
            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`))
                }
            })
        })
    }
}
