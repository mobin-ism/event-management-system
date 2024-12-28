import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query
} from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AttendeeService } from './attendee.service'
import { CreateAttendeeDto } from './dto/create-attendee.dto'
import { UpdateAttendeeDto } from './dto/update-attendee.dto'

@ApiTags('Attendee Management API')
@Controller('attendee')
export class AttendeeController {
    constructor(private readonly attendeeService: AttendeeService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new attendee' })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'Attendee created successfully',
        status: HttpStatus.CREATED
    })
    async create(@Body() createAttendeeDto: CreateAttendeeDto) {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Attendee created successfully',
            result: await this.attendeeService.create(createAttendeeDto)
        }
    }

    @Get()
    @ApiQuery({
        name: 'name',
        required: false,
        type: String,
        description: 'Search attendees by name',
        example: 'John Doe'
    })
    @ApiQuery({
        name: 'email',
        required: false,
        type: String,
        description: 'Search attendees by email',
        example: 'john@example.com'
    })
    @ApiOperation({ summary: 'Get all attendees with filter' })
    @ApiResponse({ description: 'Attendees found', status: HttpStatus.OK })
    async search(@Query('name') name: string, @Query('email') email: string) {
        return {
            statusCode: HttpStatus.OK,
            message: 'List of attendees',
            result: await this.attendeeService.searchAttendees(name, email)
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an Attendee' })
    @ApiResponse({ description: 'Attendee found', status: HttpStatus.OK })
    @ApiResponse({
        description: 'Attendee not found',
        status: HttpStatus.NOT_FOUND
    })
    async findOne(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Attendee found',
            result: await this.attendeeService.findOne(id)
        }
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an Attendee' })
    @ApiResponse({ description: 'Attendee updated', status: HttpStatus.OK })
    @ApiResponse({
        description: 'Attendee not found',
        status: HttpStatus.NOT_FOUND
    })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    async update(
        @Param('id') id: string,
        @Body() updateAttendeeDto: UpdateAttendeeDto
    ) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Attendee updated successfully',
            result: await this.attendeeService.update(id, updateAttendeeDto)
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an Attendee' })
    @ApiResponse({ description: 'Attendee deleted', status: HttpStatus.OK })
    @ApiResponse({
        description: 'Attendee not found',
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
            message: 'Attendee deleted successfully',
            result: await this.attendeeService.remove(id)
        }
    }
}
