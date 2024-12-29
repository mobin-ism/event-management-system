import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheService } from '../cache/cache.service'
import { WebsocketGateway } from '../websocket/websocket.gateway'
import { WebsocketService } from '../websocket/websocket.service'
import { Event } from './entities/event.entity'
import { EventCacheService } from './event-cache.service'
import { EventController } from './event.controller'
import { EventService } from './event.service'

@Module({
    imports: [TypeOrmModule.forFeature([Event]), ScheduleModule.forRoot()],
    controllers: [EventController],
    providers: [
        EventService,
        CacheService,
        EventCacheService,
        WebsocketGateway,
        WebsocketService
    ],
    exports: [EventService]
})
export class EventModule {}
