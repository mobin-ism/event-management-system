import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cache } from 'cache-manager'

@Injectable()
export class CacheService {
    private readonly logger = new Logger(CacheService.name)
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    // Get list with key
    async getList<T>(key: string): Promise<T[]> {
        const cachedData = await this.cacheManager.get<T[]>(key)
        return cachedData || []
    }

    // Set list with key
    async setList<T>(key: string, data: T[], ttl?: number): Promise<void> {
        await this.cacheManager.set(key, data, ttl)
    }

    // Get single item
    async getItem<T>(key: string): Promise<T | null> {
        return await this.cacheManager.get<T>(key)
    }

    // Set single item
    async setItem<T>(key: string, data: T, ttl?: number): Promise<void> {
        await this.cacheManager.set(key, data, ttl)
    }

    // Update item in a list
    async updateItemInList<T extends { id: string }>(
        listKey: string,
        updatedItem: T
    ): Promise<void> {
        const list = await this.getList<T>(listKey)
        const index = list.findIndex((item) => item.id === updatedItem.id)

        if (index !== -1) {
            list[index] = updatedItem
            await this.setList(listKey, list)
        }
    }

    // Add item to list
    async addItemToList<T>(listKey: string, newItem: T): Promise<void> {
        try {
            const list = await this.getList<T>(listKey)
            list.push(newItem)
            await this.setList(listKey, list)
        } catch (error) {
            this.logger.log('Error adding item to list')
        }
    }

    // Remove item from list
    async removeItemFromList<T extends { id: string }>(
        listKey: string,
        itemId: string
    ): Promise<void> {
        const list = await this.getList<T>(listKey)
        const filteredList = list.filter((item) => item.id !== itemId)
        await this.setList(listKey, filteredList)
    }

    // Delete cache by key
    async delete(key: string): Promise<void> {
        await this.cacheManager.del(key)
    }
}
