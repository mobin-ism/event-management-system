import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AttendeeCacheService } from './attendee-cache.service'
import { CreateAttendeeDto } from './dto/create-attendee.dto'
import { UpdateAttendeeDto } from './dto/update-attendee.dto'
import { Attendee } from './entities/attendee.entity'

@Injectable()
export class AttendeeService {
    private readonly logger = new Logger(AttendeeService.name)
    constructor(
        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>,
        private readonly attendeeCacheService: AttendeeCacheService
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
            // Add the created attendee to the cache
            this.attendeeCacheService.create(createdAttendee)
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
        const cachedAttendees = await this.attendeeCacheService.findAll()
        if (cachedAttendees.length > 0) {
            return cachedAttendees
        }
        const attendees = await this.attendeeRepository.find({
            relations: {
                registrations: {
                    event: true
                }
            }
        })

        // Set the attendees in the cache
        this.attendeeCacheService.setAll(attendees)

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
        const cachedAttendee = await this.attendeeCacheService.findOne(id)

        // If not in cache, get from database
        const attendee = await this.attendeeRepository.findOne({
            where: { id },
            relations: {
                registrations: {
                    event: true
                }
            }
        })

        if (!attendee) {
            throw new NotFoundException(`Attendee with ID ${id} not found`)
        }

        // Add the attendee to the cache
        this.attendeeCacheService.setOne(attendee)

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
            this.attendeeCacheService.update(updatedAttendee)

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

            // Remove the attendee from the cache
            this.attendeeCacheService.remove(attendee)

            return attendee
        } catch (error) {
            this.logger.error(error.message)
            throw new BadRequestException('Bad Request')
        }
    }

    /**
     * Update the details of an attendee with the events details in the cache
     */
    async updateAttendeesInEvent(attendeeId: string) {
        // Get the attendee from the database
        const attendee = await this.attendeeRepository.findOne({
            where: { id: attendeeId },
            relations: {
                registrations: {
                    event: true
                }
            }
        })
        // Update the attendee in the cache
        this.attendeeCacheService.update(attendee)
    }
}
