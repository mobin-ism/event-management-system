import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheService } from '../cache/cache.service'
import { AttendeeController } from './attendee.controller'
import { AttendeeService } from './attendee.service'
import { Attendee } from './entities/attendee.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Attendee])],
    controllers: [AttendeeController],
    providers: [AttendeeService, CacheService],
    exports: [AttendeeService]
})
export class AttendeeModule {}
