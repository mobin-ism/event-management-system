import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { isArray } from 'class-validator'
import { CacheService } from '../cache/cache.service'
import { Event } from './entities/event.entity'

@Injectable()
export class EventCacheService {
    private logger = new Logger(EventCacheService.name)
    private readonly CACHE_KEY = 'events'
    private readonly CACHE_PREFIX = 'event:'
    private readonly CACHE_TTL = parseInt(process.env.TTL) // 1 hour in seconds

    /**
     * @param cacheService
     */
    constructor(private readonly cacheService: CacheService) {}

    /**
     * Creating a new event
     * @param event
     * @returns
     */
    async create(event: Event) {
        try {
            // Add the item to the cache
            this.cacheService.addItemToList(this.CACHE_KEY, event)
            // Set the created event in the cache
            this.cacheService.setItem(
                `${this.CACHE_PREFIX}${event.id}`,
                event,
                this.CACHE_TTL
            )
        } catch (error) {
            this.logger.error(error.message)
            throw new BadRequestException(error.message)
        }
    }

    /**
     * Return all the events
     * @returns
     */
    async findAll() {
        // Try cache first
        return await this.cacheService.getList<Event>(this.CACHE_KEY)
    }

    /**
     * Set all the events in the cache
     */
    async setAll(events: Event[]) {
        // Set the events in the cache
        this.cacheService.setList(this.CACHE_KEY, events, this.CACHE_TTL)
    }

    /**
     * Return a single event
     * @param id
     * @returns
     */
    async findOne(id: string) {
        // Try cache first
        const cachedEvent = await this.cacheService.getItem<Event>(
            `${this.CACHE_PREFIX}${id}`
        )
        if (cachedEvent) {
            return isArray(cachedEvent) ? cachedEvent[0] : cachedEvent
        }
        return null
    }

    /**
     * Set single iem in the cache
     */
    async setOne(event: Event) {
        // Add the event to the cache
        this.cacheService.addItemToList(
            `${this.CACHE_PREFIX}${event.id}`,
            event
        )
        // Set the event in the cache
        this.cacheService.setItem(
            `${this.CACHE_PREFIX}${event.id}`,
            event,
            this.CACHE_TTL
        )
        return event
    }

    /**
     * Updating an event
     * @param id
     * @param updateEventDto
     * @returns
     */
    async update(event: Event) {
        try {
            //Update the event in the cache
            this.cacheService.updateItemInList(this.CACHE_KEY, event)
            // Delete the event from the cache
            this.cacheService.delete(`${this.CACHE_PREFIX}${event.id}`)
            // Update the event in the cache
            this.cacheService.setItem(
                `${this.CACHE_PREFIX}${event.id}`,
                event,
                this.CACHE_TTL
            )
        } catch (error) {
            this.logger.error(error.message)
            throw new BadRequestException(error.message)
        }
    }

    /**
     * Deleting an event
     * @param id
     * @returns
     */
    async remove(event: Event) {
        try {
            // Remove the event from the cache
            this.cacheService.removeItemFromList<Event>(
                this.CACHE_KEY,
                event.id
            )
            // Remove the event from the cache
            this.cacheService.delete(`${this.CACHE_PREFIX}${event.id}`)
        } catch (error) {
            this.logger.error(error.message)
            throw new BadRequestException(error.message)
        }
    }
}
