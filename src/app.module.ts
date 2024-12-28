import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmAsyncConfig } from 'src/config/typeorm.config'
import { AttendeeModule } from './modules/attendee/attendee.module'
import { EventModule } from './modules/event/event.module'
import { RegistrationModule } from './modules/registration/registration.module';
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            isGlobal: true,
            cache: true
        }),
        ThrottlerModule.forRootAsync({
            useFactory: async () => ({
                throttlers: [
                    {
                        ttl:
                            parseInt(
                                process.env.RATE_LIMITER_TIME_TO_LEAVE,
                                10
                            ) || 60000, // default to 60000 if env variable not present
                        limit:
                            parseInt(process.env.RATE_LIMITER_MAX_TRY, 10) || 10 // default to 10 if env variable not present
                    }
                ]
            })
        }),
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
        ScheduleModule.forRoot(),
        EventModule,
        AttendeeModule,
        RegistrationModule
    ],
    exports: [TypeOrmModule]
})
export class AppModule {}
