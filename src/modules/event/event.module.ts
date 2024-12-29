import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheService } from '../cache/cache.service'
import { Event } from './entities/event.entity'
import { EventCacheService } from './event-cache.service'
import { EventController } from './event.controller'
import { EventService } from './event.service'

@Module({
    imports: [TypeOrmModule.forFeature([Event])],
    controllers: [EventController],
    providers: [EventService, CacheService, EventCacheService],
    exports: [EventService]
})
export class EventModule {}
