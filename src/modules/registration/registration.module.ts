import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AttendeeModule } from '../attendee/attendee.module'
import { CacheService } from '../cache/cache.service'
import { EventModule } from '../event/event.module'
import { Registration } from './entities/registration.entity'
import { RegistrationCacheService } from './registration-cache.service'
import { RegistrationController } from './registration.controller'
import { RegistrationService } from './registration.service'

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        TypeOrmModule.forFeature([Registration]),
        EventModule,
        AttendeeModule
    ],
    controllers: [RegistrationController],
    providers: [RegistrationService, CacheService, RegistrationCacheService]
})
export class RegistrationModule {}
