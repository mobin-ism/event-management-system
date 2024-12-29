import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { isArray } from 'class-validator'
import { CacheService } from '../cache/cache.service'
import { Attendee } from './entities/attendee.entity'

@Injectable()
export class AttendeeCacheService {
    private logger = new Logger(AttendeeCacheService.name)
    private readonly CACHE_KEY = 'attendees'
    private readonly CACHE_PREFIX = 'attendee:'
    private readonly CACHE_TTL = parseInt(process.env.TTL) // 1 hour in seconds

    /**
     * @param cacheService
     */
    constructor(private readonly cacheService: CacheService) {}

    /**
     * Creating a new item
     * @param attendee
     * @returns
     */
    async create(attendee: Attendee) {
        try {
            // Add the item to the cache
            this.cacheService.addItemToList(this.CACHE_KEY, attendee)
            // Set the created attendee in the cache
            this.cacheService.setItem(
                `${this.CACHE_PREFIX}${attendee.id}`,
                attendee,
                this.CACHE_TTL
            )
        } catch (error) {
            this.logger.error(error.message)
            throw new BadRequestException(error.message)
        }
    }

    /**
     * Return all the attendees
     * @returns
     */
    async findAll() {
        // Try cache first
        return await this.cacheService.getList<Attendee>(this.CACHE_KEY)
    }

    /**
     * Set all the attendees in the cache
     */
    async setAll(attendees: Attendee[]) {
        // Set the attendees in the cache
        this.cacheService.setList(this.CACHE_KEY, attendees, this.CACHE_TTL)
    }

    /**
     * Return a single attendee
     * @param id
     * @returns
     */
    async findOne(id: string) {
        // Try cache first
        const cachedItem = await this.cacheService.getItem<Attendee>(
            `${this.CACHE_PREFIX}${id}`
        )
        if (cachedItem) {
            return isArray(cachedItem) ? cachedItem[0] : cachedItem
        }
        return null
    }

    /**
     * Set single item in the cache
     */
    async setOne(attendee: Attendee) {
        // Add the item to the cache
        this.cacheService.addItemToList(
            `${this.CACHE_PREFIX}${attendee.id}`,
            attendee
        )
        // Set the item in the cache
        this.cacheService.setItem(
            `${this.CACHE_PREFIX}${attendee.id}`,
            attendee,
            this.CACHE_TTL
        )
        return attendee
    }

    /**
     * Updating an item
     * @param attendee
     * @returns
     */
    async update(attendee: Attendee) {
        try {
            //Update the item in the cache
            this.cacheService.updateItemInList(this.CACHE_KEY, attendee)
            // Delete the item from the cache
            this.cacheService.delete(`${this.CACHE_PREFIX}${attendee.id}`)
            // Update the item in the cache
            this.cacheService.setItem(
                `${this.CACHE_PREFIX}${attendee.id}`,
                attendee,
                this.CACHE_TTL
            )
        } catch (error) {
            this.logger.error(error.message)
            throw new BadRequestException(error.message)
        }
    }

    /**
     * Deleting an item
     * @param id
     * @returns
     */
    async remove(attendee: Attendee) {
        try {
            // Remove the item from the cache
            this.cacheService.removeItemFromList<Attendee>(
                this.CACHE_KEY,
                attendee.id
            )
            // Remove the item from the cache
            this.cacheService.delete(`${this.CACHE_PREFIX}${attendee.id}`)
        } catch (error) {
            this.logger.error(error.message)
            throw new BadRequestException(error.message)
        }
    }
}
