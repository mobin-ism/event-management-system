import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { isArray } from 'class-validator'
import { CacheService } from '../cache/cache.service'
import { Registration } from './entities/registration.entity'

@Injectable()
export class RegistrationCacheService {
    private logger = new Logger(RegistrationCacheService.name)
    private readonly CACHE_KEY = 'registrations'
    private readonly CACHE_PREFIX = 'registration:'
    private readonly CACHE_TTL = parseInt(process.env.TTL) // 1 hour in seconds

    /**
     * @param cacheService
     */
    constructor(private readonly cacheService: CacheService) {}

    /**
     * Creating a new item
     * @param registraion
     * @returns
     */
    async create(registraion: Registration) {
        try {
            // Add the item to the cache
            this.cacheService.addItemToList(this.CACHE_KEY, registraion)
            // Set the created registraion in the cache
            this.cacheService.setItem(
                `${this.CACHE_PREFIX}${registraion.id}`,
                registraion,
                this.CACHE_TTL
            )
        } catch (error) {
            this.logger.error(error.message)
            throw new BadRequestException(error.message)
        }
    }

    /**
     * Return all the items
     * @returns
     */
    async findAll() {
        // Try cache first
        return await this.cacheService.getList<Registration>(this.CACHE_KEY)
    }

    /**
     * Set all the registraions in the cache
     */
    async setAll(registraions: Registration[]) {
        // Set the registraions in the cache
        this.cacheService.setList(this.CACHE_KEY, registraions, this.CACHE_TTL)
    }

    /**
     * Return a single registraion
     * @param id
     * @returns
     */
    async findOne(id: string) {
        // Try cache first
        const cachedItem = await this.cacheService.getItem<Registration>(
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
    async setOne(registraion: Registration) {
        // Add the item to the cache
        this.cacheService.addItemToList(
            `${this.CACHE_PREFIX}${registraion.id}`,
            registraion
        )
        // Set the item in the cache
        this.cacheService.setItem(
            `${this.CACHE_PREFIX}${registraion.id}`,
            registraion,
            this.CACHE_TTL
        )
        return registraion
    }

    /**
     * Updating an item
     * @param registraion
     * @returns
     */
    async update(registraion: Registration) {
        try {
            //Update the item in the cache
            this.cacheService.updateItemInList(this.CACHE_KEY, registraion)
            // Delete the item from the cache
            this.cacheService.delete(`${this.CACHE_PREFIX}${registraion.id}`)
            // Update the item in the cache
            this.cacheService.setItem(
                `${this.CACHE_PREFIX}${registraion.id}`,
                registraion,
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
    async remove(registraion: Registration) {
        try {
            // Remove the item from the cache
            this.cacheService.removeItemFromList<Registration>(
                this.CACHE_KEY,
                registraion.id
            )
            // Remove the item from the cache
            this.cacheService.delete(`${this.CACHE_PREFIX}${registraion.id}`)
        } catch (error) {
            this.logger.error(error.message)
            throw new BadRequestException(error.message)
        }
    }
}
