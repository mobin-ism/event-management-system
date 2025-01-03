import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { WebsocketGateway } from '../websocket/websocket.gateway'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { Event } from './entities/event.entity'
import { EventCacheService } from './event-cache.service'

@Injectable()
export class EventService {
    private logger = new Logger(EventService.name)

    /**
     * Constructor
     * @param eventRepository
     * @param cacheService
     */
    constructor(
        // Inject the EventRepository
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        private readonly eventCacheService: EventCacheService,
        private readonly eventEmitter: EventEmitter2,
        private readonly webSocketGateway: WebsocketGateway
    ) {}

    /**
     * Creating a new event
     * @param createEventDto
     * @returns
     */
    async create(createEventDto: CreateEventDto) {
        try {
            const event = this.eventRepository.create(createEventDto)
            const createdEvent = await this.eventRepository.save(event)
            // Add the created event to the cache
            this.eventCacheService.create(createdEvent)
            // Notify the clients
            this.webSocketGateway.server.emit(
                'new-event',
                `New event has been organized: ${createdEvent.name}`
            )
            return createdEvent
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
        // Try cache first
        const cachedEvents = await this.eventCacheService.findAll()
        if (cachedEvents.length > 0) {
            return cachedEvents
        }

        // If not in cache, get from database
        const events = await this.eventRepository.find({
            relations: {
                eventAttendees: {
                    attendee: true
                }
            }
        })
        // Set the events in the cache
        this.eventCacheService.setAll(events)
        return events
    }

    /**
     * Return a single event
     * @param id
     * @returns
     */
    async findOne(id: string) {
        // Try cache first
        const cachedEvent = await this.eventCacheService.findOne(id)
        if (cachedEvent) {
            return cachedEvent
        }
        const event = await this.eventRepository.findOne({
            where: { id },
            relations: {
                eventAttendees: {
                    attendee: true
                }
            }
        })

        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`)
        }

        // Add the event to the cache
        this.eventCacheService.setOne(event)
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
        event.name = updateEventDto.name ?? event.name
        event.description = updateEventDto.description ?? event.description
        event.location = updateEventDto.location ?? event.location
        event.maxAttendees = updateEventDto.maxAttendees ?? event.maxAttendees
        event.date = updateEventDto.date ?? event.date
        try {
            const updatedEvent = await this.eventRepository.save(event)

            // Update the event in the cache
            this.eventCacheService.update(updatedEvent)

            return updatedEvent
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
            await this.eventRepository.delete(event.id)
            // Remove the event from the cache
            this.eventCacheService.remove(event)
            return event
        } catch (error) {
            this.logger.error(error.message)
            throw new BadRequestException(error.message)
        }
    }

    /**
     * CHECK IF THE EVENT IS FULL
     */
    async isEventFull(eventId: string) {
        const event = await this.findOne(eventId)
        return (
            event.eventAttendees &&
            event.eventAttendees.length >= event.maxAttendees
        )
    }

    /**
     * FINDING ALL THE EVENT BY DATE RANGE
     */
    async findEventByDateRange(from: Date, to: Date) {
        console.log('hello')
        return await this.eventRepository.find({
            where: {
                date: Between(from, to)
            },
            relations: {
                eventAttendees: {
                    attendee: true
                }
            }
        })
    }

    /**
     * Update event attendees in the cache
     */
    async updateEventAttendees(eventId: string) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId },
            relations: {
                eventAttendees: {
                    attendee: true
                }
            }
        })
        this.eventCacheService.update(event)
    }

    /**
     * Send reminder before 24 hours
     */
    @Cron(CronExpression.EVERY_DAY_AT_10AM)
    async sendReminder() {
        const today = new Date()
        // Get the next date as a Date object
        const nextDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1
        )

        const events = await this.eventRepository.find({
            where: { date: nextDate },
            relations: {
                eventAttendees: {
                    attendee: true
                }
            }
        })

        const reminders = []
        for (const event of events) {
            for (const attendee of event.eventAttendees) {
                reminders.push({
                    username: attendee.attendee.name,
                    useremail: attendee.attendee.email,
                    emailBody: `Hello ${attendee.attendee.name}, your event ${event.name} is tomorrow.`
                })
            }
        }

        // Send the reminders
        this.eventEmitter.emit('event-reminder', reminders)
    }
}
