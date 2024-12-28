import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { CreateAttendeeDto } from './dto/create-attendee.dto'
import { UpdateAttendeeDto } from './dto/update-attendee.dto'
import { Attendee } from './entities/attendee.entity'

@Injectable()
export class AttendeeService {
    private readonly logger = new Logger(AttendeeService.name)
    constructor(
        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>
    ) {}

    /**
     * Create a new attendee
     * @param createAttendeeDto
     * @returns
     */
    async create(createAttendeeDto: CreateAttendeeDto) {
        try {
            const attendee = this.attendeeRepository.create(createAttendeeDto)
            return await this.attendeeRepository.save(attendee)
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
        return await this.attendeeRepository.find()
    }

    /**
     * Search attendees by name or email using ILike
     */
    async searchAttendees(name?: string, email?: string) {
        const whereClause = {}
        if (name) {
            whereClause['name'] = ILike(`%${name}%`)
        }
        if (email) {
            whereClause['email'] = ILike(`%${email}%`)
        }
        return await this.attendeeRepository.find({
            where: [whereClause],
            order: {
                name: 'ASC'
            }
        })
    }

    /**
     * Return a single attendee
     * @param id
     * @returns
     */
    async findOne(id: string) {
        const attendee = await this.attendeeRepository.findOne({
            where: { id }
        })

        if (!attendee) {
            throw new NotFoundException(`Attendee with ID ${id} not found`)
        }
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
        try {
            await this.attendeeRepository.update(attendee.id, updateAttendeeDto)
            return await this.findOne(id)
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
            await this.attendeeRepository.softDelete(attendee.id)
            return attendee
        } catch (error) {
            this.logger.error(error.message)
            throw new BadRequestException('Bad Request')
        }
    }
}
