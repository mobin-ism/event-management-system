import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AttendeeService } from '../attendee/attendee.service'
import { EventService } from '../event/event.service'
import { CreateRegistrationDto } from './dto/create-registration.dto'
import { Registration } from './entities/registration.entity'

@Injectable()
export class RegistrationService {
    constructor(
        @InjectRepository(Registration)
        private registrationRepository: Repository<Registration>,
        private readonly eventService: EventService,
        private readonly attendeeService: AttendeeService
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
        const isEventFull = await this.eventService.isEventFull(event.id)
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
            return await this.registrationRepository.save(registration)
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }

    /**
     * FIND ALL REGISTRATION
     * @returns
     */
    async findAll() {
        return await this.registrationRepository.find()
    }

    /**
     * Finding a single registration
     * @param id
     * @returns
     */
    async findOne(id: string) {
        return await this.registrationRepository.findOne({
            where: { id },
            relations: {
                event: true,
                attendee: true
            }
        })
    }

    /**
     * CHECK DUPLICATE REGISTRATION
     */
    async checkDuplicateRegistration(eventId: string, attendeeId: string) {
        return await this.registrationRepository.findOne({
            where: { eventId, attendeeId }
        })
    }
}
