import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AttendeeModule } from '../attendee/attendee.module'
import { EventModule } from '../event/event.module'
import { Registration } from './entities/registration.entity'
import { RegistrationController } from './registration.controller'
import { RegistrationService } from './registration.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([Registration]),
        EventModule,
        AttendeeModule
    ],
    controllers: [RegistrationController],
    providers: [RegistrationService]
})
export class RegistrationModule {}
