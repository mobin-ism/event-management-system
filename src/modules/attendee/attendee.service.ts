import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isArray } from 'class-validator'
import { Repository } from 'typeorm'
import { CacheService } from '../cache/cache.service'
import { CreateAttendeeDto } from './dto/create-attendee.dto'
import { UpdateAttendeeDto } from './dto/update-attendee.dto'
import { Attendee } from './entities/attendee.entity'

@Injectable()
export class AttendeeService {
    private readonly logger = new Logger(AttendeeService.name)
    private readonly CACHE_KEY = 'attendees'
    private readonly CACHE_PREFIX = 'attendee:'
    private readonly CACHE_TTL = parseInt(process.env.TTL) // 1 hour in seconds
    constructor(
        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>,
        private readonly cacheService: CacheService
    ) {}

    /**
     * Create a new attendee
     * @param createAttendeeDto
     * @returns
     */
    async create(createAttendeeDto: CreateAttendeeDto) {
        try {
            const attendee = this.attendeeRepository.create(createAttendeeDto)
            const createdAttendee = await this.attendeeRepository.save(attendee)
            // Add the created item to the cache
            this.cacheService.addItemToList(this.CACHE_KEY, createdAttendee)
            this.cacheService.setItem(
                `${this.CACHE_PREFIX}${createdAttendee.id}`,
                createdAttendee,
                this.CACHE_TTL
            )
            return createdAttendee
        } catch (error) {
            this.logger.error(error.message)
            if (error.code === '23505') {
                throw new ConflictException(
                    `The Email ${createAttendeeDto.email} already exists`
                )
            }
            throw new BadRequestException('Bad Request')
        }
    }

    /**
     * Get all attendee
     * @returns
     */
    async findAll() {
        // Try cache first
        const cachedAttendees = await this.cacheService.getList<Attendee>(
            this.CACHE_KEY
        )
        if (cachedAttendees.length > 0) {
            return cachedAttendees
        }
        const attendees = await this.attendeeRepository.find()
        await this.cacheService.setList(
            this.CACHE_KEY,
            attendees,
            this.CACHE_TTL
        )
        return attendees
    }

    /**
     * Search attendees by name or email using ILike
     */
    async searchAttendees(name?: string, email?: string) {
        const attendees = await this.findAll()
        // Perform filtering in memory
        return attendees.filter((attendee) => {
            const nameMatch =
                !name ||
                attendee.name.toLowerCase().includes(name.toLowerCase())
            const emailMatch =
                !email ||
                attendee.email.toLowerCase().includes(email.toLowerCase())
            return nameMatch && emailMatch
        })
    }

    /**
     * Return a single attendee
     * @param id
     * @returns
     */
    async findOne(id: string) {
        // Try cache first
        const cachedAttendee = await this.cacheService.getItem<Attendee>(
            `${this.CACHE_PREFIX}${id}`
        )
        if (cachedAttendee) {
            return isArray(cachedAttendee) ? cachedAttendee[0] : cachedAttendee
        }

        // If not in cache, get from database
        const attendee = await this.attendeeRepository.findOne({
            where: { id }
        })

        if (!attendee) {
            throw new NotFoundException(`Attendee with ID ${id} not found`)
        }

        // Add the attendee to the cache
        this.cacheService.addItemToList(`${this.CACHE_PREFIX}${id}`, attendee)
        // Set the attendee in the cache
        this.cacheService.setItem(
            `${this.CACHE_PREFIX}${id}`,
            attendee,
            this.CACHE_TTL
        )

        return attendee
    }

    /**
     * Update an attendee
     * @param id
     * @param updateAttendeeDto
     * @returns
     */
    async update(id: string, updateAttendeeDto: UpdateAttendeeDto) {
        const attendee = await this.findOne(id)
        attendee.name = updateAttendeeDto.name ?? attendee.name
        attendee.email = updateAttendeeDto.email ?? attendee.email

        try {
            const updatedAttendee = await this.attendeeRepository.save(attendee)

            //Update the attendee in the cache
            this.cacheService.updateItemInList(this.CACHE_KEY, updatedAttendee)
            // Delete the attendee from the cache
            this.cacheService.delete(`${this.CACHE_PREFIX}${id}`)
            // Update the attendee in the cache
            this.cacheService.setItem(
                `${this.CACHE_PREFIX}${id}`,
                updatedAttendee,
                this.CACHE_TTL
            )

            return updatedAttendee
        } catch (error) {
            this.logger.error(error.message)
            if (error.code === '23505') {
                throw new ConflictException(
                    `The Email ${updateAttendeeDto.email} already exists`
                )
            }
            throw new BadRequestException('Bad Request')
        }
    }

    /**
     * Delete an attendee
     * @param id
     * @returns
     */
    async remove(id: string) {
        const attendee = await this.findOne(id)
        try {
            await this.attendeeRepository.delete(attendee.id)
            // Remove the attendee from the cache list
            this.cacheService.removeItemFromList<Attendee>(
                this.CACHE_KEY,
                attendee.id
            )
            // Remove the attendee from the cache
            this.cacheService.delete(`${this.CACHE_PREFIX}${id}`)
            return attendee
        } catch (error) {
            this.logger.error(error.message)
            throw new BadRequestException('Bad Request')
        }
    }
}
