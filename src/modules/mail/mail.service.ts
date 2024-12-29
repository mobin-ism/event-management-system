import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { join } from 'path'
import { Worker } from 'worker_threads'
import { Registration } from '../registration/entities/registration.entity'
@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name)
    @OnEvent('registration-confirmation')
    async sendRegistrationConfirmationEmail(
        registrationData: Registration
    ): Promise<void> {
        const data = {
            username: registrationData.attendee.name,
            useremail: registrationData.attendee.email,
            emailBody: `Hello ${registrationData.attendee.name}, your registration for ${registrationData.event.name} is confirmed!`
        }
        return new Promise((resolve, reject) => {
            const worker = new Worker(join(__dirname, 'email.worker.js'), {
                workerData: {
                    template: 'registration-confirmation',
                    data: data
                }
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

    @OnEvent('event-reminder')
    async sendEventReminder(reminders: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const worker = new Worker(join(__dirname, 'email.worker.js'), {
                workerData: {
                    template: 'event-reminder',
                    data: reminders
                }
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
