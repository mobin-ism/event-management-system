import { isArray } from 'class-validator'
import * as fs from 'fs/promises'
import * as handlebars from 'handlebars'
import { createTransport, Transporter } from 'nodemailer'
import * as path from 'path'
import { parentPort, workerData } from 'worker_threads'

class EmailWorker {
    private transporter: Transporter
    private templatesDir: string
    private readonly transportConfig = {
        host: process.env.SMTP_HOST,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    }
    constructor() {
        this.transporter = createTransport(this.transportConfig)
        this.templatesDir = path.join(__dirname, 'templates')
    }

    private async getTemplate(
        name: string
    ): Promise<handlebars.TemplateDelegate> {
        const filePath = path.join(this.templatesDir, `${name}.hbs`)
        const templateContent = await fs.readFile(filePath, 'utf-8')
        return handlebars.compile(templateContent)
    }

    async sendEmail(templateName: string, data: any) {
        try {
            // Get and compile template
            const template = await this.getTemplate(templateName)
            const html = template(data)
            // Send email
            const result = await this.transporter.sendMail({
                from: process.env.SMTP_MAIL_FROM,
                to: data.useremail,
                subject: this.getSubject(templateName),
                html
            })

            return { success: true, messageId: result.messageId }
        } catch (error) {
            throw new Error(`Failed to send email: ${error.message}`)
        }
    }

    private getSubject(templateName: string): string {
        const subjects = {
            'registration-confirmation': 'Registration Confirmation',
            'event-reminder': 'Event Reminder'
        }
        return subjects[templateName] || 'New Message'
    }
}

async function processEmailInWorker() {
    const { template, data } = workerData
    const emailWorker = new EmailWorker()

    try {
        if (isArray(data)) {
            for (const item of data) {
                const result = await emailWorker.sendEmail(template, item)
                parentPort.postMessage(result)
            }
        } else {
            const result = await emailWorker.sendEmail(template, data)
            parentPort.postMessage(result)
        }
    } catch (error) {
        parentPort.postMessage({
            success: false,
            error: error.message
        })
    }
}

// Execute the worker
processEmailInWorker()
