import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { join } from 'path'

export const MailerModuleConfig = {
    useFactory: () => ({
        transport: {
            host: process.env.SMTP_HOST,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        },
        template: {
            dir: join(__dirname, '../modules/mail/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
                strict: true
            }
        }
    })
}
