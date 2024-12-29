import * as fs from 'fs/promises'
import * as handlebars from 'handlebars'
import { createTransport, Transporter } from 'nodemailer'
import * as path from 'path'
import { parentPort } from 'worker_threads'

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

    async sendEmail(templateName: string, userData: any) {
        try {
            // Get and compile template
            const template = await this.getTemplate(templateName)
            const html = template(userData)

            // Send email
            const result = await this.transporter.sendMail({
                from: 'almobin777@gmail.com',
                to: 'mobin@anchorblock.vc',
                subject: 'Hello world',
                html
            })

            return { success: true, messageId: result.messageId }
        } catch (error) {
            throw new Error(`Failed to send email: ${error.message}`)
        }
    }

    private getSubject(templateName: string): string {
        const subjects = {
            'registration-confirmation': 'Welcome to Our Platform'
        }
        return subjects[templateName] || 'New Message'
    }
}

async function processEmailInWorker() {
    // const { templateName, userData } = workerData
    const templateName = 'registration-confirmation'
    const userData = {
        email: 'mobin@anchorblock.vc',
        name: 'Al Mobin'
    }
    const emailWorker = new EmailWorker()

    try {
        const result = await emailWorker.sendEmail(templateName, userData)
        parentPort.postMessage(result)
    } catch (error) {
        parentPort.postMessage({
            success: false,
            error: error.message
        })
    }
}

// Execute the worker
processEmailInWorker()
