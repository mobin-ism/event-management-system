import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheService } from '../cache/cache.service'
import { Event } from './entities/event.entity'
import { EventController } from './event.controller'
import { EventService } from './event.service'

@Module({
    imports: [TypeOrmModule.forFeature([Event])],
    controllers: [EventController],
    providers: [EventService, CacheService],
    exports: [EventService]
})
export class EventModule {}
