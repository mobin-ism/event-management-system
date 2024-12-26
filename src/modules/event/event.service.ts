import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { Event } from './entities/event.entity'

@Injectable()
export class EventService {
    private logger = new Logger(EventService.name)
    constructor(
        // Inject the EventRepository
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>
    ) {}

    /**
     * Creating a new event
     * @param createEventDto
     * @returns
     */
    async create(createEventDto: CreateEventDto) {
        try {
            const event = this.eventRepository.create(createEventDto)
            await this.eventRepository.save(event)
            return event
        } catch (error) {
            this.logger.error(error.message)
            if (error.code === '23505') {
                throw new ConflictException(
                    `An event will already take place at ${createEventDto.date} in ${createEventDto.location}`
                )
            }
            throw new BadRequestException(error.message)
        }
    }

    /**
     * Return all the events
     * @returns
     */
    async findAll() {
        return await this.eventRepository.find()
    }

    /**
     * Return a single event
     * @param id
     * @returns
     */
    async findOne(id: string) {
        const event = await this.eventRepository.findOne({
            where: { id }
        })

        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`)
        }

        return event
    }

    /**
     * Updating an event
     * @param id
     * @param updateEventDto
     * @returns
     */
    async update(id: string, updateEventDto: UpdateEventDto) {
        const event = await this.findOne(id)
        try {
            await this.eventRepository.update(event.id, updateEventDto)
            return await this.findOne(id)
        } catch (error) {
            this.logger.error(error.message)
            if (error.code === '23505') {
                throw new ConflictException(
                    `An event will already take place at ${updateEventDto.date} in ${updateEventDto.location}`
                )
            }
            throw new BadRequestException(error.message)
        }
    }

    /**
     * Deleting an event
     * @param id
     * @returns
     */
    async remove(id: string) {
        const event = await this.findOne(id)
        try {
            await this.eventRepository.softDelete(event.id)
            return event
        } catch (error) {
            this.logger.error(error.message)
            throw new BadRequestException(error.message)
        }
    }
}
