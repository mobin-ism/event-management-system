import { MailerModule } from '@nestjs-modules/mailer'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TYPEORM_ASYNC_CONFIG } from 'src/config/typeorm.config'
import { CACHE_CONFIG } from './config/cache.config'
import { ENV_CONFIG } from './config/env.config'
import { MailerModuleConfig } from './config/smtp.config'
import { THROTTLER_CONFIG } from './config/throttler.config'
import { AttendeeModule } from './modules/attendee/attendee.module'
import { EventModule } from './modules/event/event.module'
import { MailModule } from './modules/mail/mail.module'
import { RegistrationModule } from './modules/registration/registration.module'
@Module({
    imports: [
        CacheModule.register(CACHE_CONFIG),
        ConfigModule.forRoot(ENV_CONFIG),
        ThrottlerModule.forRootAsync(THROTTLER_CONFIG),
        TypeOrmModule.forRootAsync(TYPEORM_ASYNC_CONFIG),
        MailerModule.forRootAsync(MailerModuleConfig),
        ScheduleModule.forRoot(),
        EventModule,
        AttendeeModule,
        RegistrationModule,
        MailModule
    ],
    exports: [TypeOrmModule]
})
export class AppModule {}
