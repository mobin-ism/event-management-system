import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { EventService } from './event.service'

@ApiTags('Event Management API')
@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new event' })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'Event created successfully',
        status: HttpStatus.CREATED
    })
    async create(@Body() createEventDto: CreateEventDto) {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Event created successfully',
            result: await this.eventService.create(createEventDto)
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all events' })
    @ApiResponse({ description: 'Events found', status: HttpStatus.OK })
    async findAll() {
        return {
            statusCode: HttpStatus.OK,
            message: 'List of events',
            result: await this.eventService.findAll()
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an Event' })
    @ApiResponse({ description: 'Event found', status: HttpStatus.OK })
    @ApiResponse({
        description: 'Event not found',
        status: HttpStatus.NOT_FOUND
    })
    async findOne(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Event found',
            result: await this.eventService.findOne(id)
        }
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an Event' })
    @ApiResponse({ description: 'Event updated', status: HttpStatus.OK })
    @ApiResponse({
        description: 'Event not found',
        status: HttpStatus.NOT_FOUND
    })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    async update(
        @Param('id') id: string,
        @Body() updateEventDto: UpdateEventDto
    ) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Event updated successfully',
            result: await this.eventService.update(id, updateEventDto)
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an Event' })
    @ApiResponse({ description: 'Event deleted', status: HttpStatus.OK })
    @ApiResponse({
        description: 'Event not found',
        status: HttpStatus.NOT_FOUND
    })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    async remove(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Event deleted successfully',
            result: await this.eventService.remove(id)
        }
    }
}
