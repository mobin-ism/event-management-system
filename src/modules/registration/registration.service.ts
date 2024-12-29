import { HttpException, Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import { isArray } from 'class-validator'
import { Repository } from 'typeorm'
import { AttendeeService } from '../attendee/attendee.service'
import { EventService } from '../event/event.service'
import { WebsocketGateway } from '../websocket/websocket.gateway'
import { CreateRegistrationDto } from './dto/create-registration.dto'
import { Registration } from './entities/registration.entity'
import { RegistrationCacheService } from './registration-cache.service'

@Injectable()
export class RegistrationService {
    private readonly logger = new Logger(RegistrationService.name)
    constructor(
        @InjectRepository(Registration)
        private registrationRepository: Repository<Registration>,
        private readonly eventService: EventService,
        private readonly attendeeService: AttendeeService,
        private readonly registrationCacheService: RegistrationCacheService,
        private eventEmitter: EventEmitter2,
        private readonly webSocketGateway: WebsocketGateway
    ) {}

    /**
     * Create a new registration
     * @param createRegistrationDto
     * @returns
     */
    async create(createRegistrationDto: CreateRegistrationDto) {
        const { eventId, attendeeId } = createRegistrationDto
        const event = await this.eventService.findOne(eventId)
        const attendee = await this.attendeeService.findOne(attendeeId)
        const isEventFull = await this.eventService.isEventFull(eventId)
        const isDuplicateRegistration = await this.checkDuplicateRegistration(
            eventId,
            attendeeId
        )

        if (isDuplicateRegistration) {
            throw new HttpException(
                'You are already registered for this event',
                400
            )
        }

        if (isEventFull) {
            throw new HttpException('Sorry the event is full', 400)
        }

        try {
            const registration = this.registrationRepository.create({
                event,
                attendee
            })
            registration.registeredAt = new Date()
            const createdRegistration =
                await this.registrationRepository.save(registration)
            // Add the created registraion to the cache
            await this.registrationCacheService.create(createdRegistration)
            // Update the event cache to the attendee and add the attendee to the event
            await this.eventService.updateEventAttendees(eventId)
            await this.attendeeService.updateAttendeesInEvent(attendeeId)
            // Notify the clients about the new registration
            this.eventEmitter.emit(
                'registration-confirmation',
                createdRegistration
            )
            // Notify the clients about the limited space
            await this.notifyClients(eventId)

            return createdRegistration
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }

    /**
     * FIND ALL REGISTRATION
     * @returns
     */
    async findAll() {
        // Try cache first
        const cachedRegistrations =
            await this.registrationCacheService.findAll()
        if (cachedRegistrations.length > 0) {
            return cachedRegistrations
        }

        // If not in cache, get from database
        const registraions = await this.registrationRepository.find({
            relations: {
                event: true,
                attendee: true
            }
        })
        // Set the registraions in the cache
        this.registrationCacheService.setAll(registraions)
        return registraions
    }

    /**
     * Finding a single registration
     * @param id
     * @returns
     */
    async findOne(id: string) {
        // Try cache first
        const cachedRegistraion =
            await this.registrationCacheService.findOne(id)
        if (cachedRegistraion) {
            return isArray(cachedRegistraion)
                ? cachedRegistraion[0]
                : cachedRegistraion
        }
        const registration = await this.registrationRepository.findOne({
            where: { id },
            relations: {
                event: true,
                attendee: true
            }
        })

        // Add the registration to the cache
        this.registrationCacheService.setOne(registration)

        return registration
    }

    /**
     * CHECK DUPLICATE REGISTRATION
     */
    async checkDuplicateRegistration(eventId: string, attendeeId: string) {
        return await this.registrationRepository.findOne({
            where: { eventId, attendeeId }
        })
    }

    /**
     * CANCEL REGISTRATION
     * @param id
     * @returns
     */
    async remove(id: string) {
        const registration = await this.findOne(id)
        try {
            await this.registrationRepository.remove(registration)
            // Remove the registration from the cache
            this.registrationCacheService.remove(registration)
            return registration
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }

    /**
     * Notify the clients about the limited space
     * @param event
     */
    private async notifyClients(eventId: string) {
        const event = await this.eventService.findOne(eventId)
        const availableSpace = event.maxAttendees - event.eventAttendees.length
        if (availableSpace <= 2) {
            this.webSocketGateway.server.emit(
                'event-availability',
                `Heads up! Seat is going to fill up for: ${event.name}. Only ${availableSpace} is remaining`
            )
        }
    }
}
