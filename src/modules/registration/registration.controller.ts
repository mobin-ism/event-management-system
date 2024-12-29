import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateRegistrationDto } from './dto/create-registration.dto'
import { RegistrationService } from './registration.service'

@ApiTags('Registration Management API')
@Controller('registration')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new registration' })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'Registration created successfully',
        status: HttpStatus.CREATED
    })
    async create(@Body() createRegistrationDto: CreateRegistrationDto) {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Registration created successfully',
            result: await this.registrationService.create(createRegistrationDto)
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all registrations' })
    @ApiResponse({ description: 'Registrations found', status: HttpStatus.OK })
    async findAll() {
        return {
            statusCode: HttpStatus.OK,
            message: 'List of registrations',
            result: await this.registrationService.findAll()
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an Registration' })
    @ApiResponse({ description: 'Registration found', status: HttpStatus.OK })
    @ApiResponse({
        description: 'Registration not found',
        status: HttpStatus.NOT_FOUND
    })
    async findOne(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Registration found',
            result: await this.registrationService.findOne(id)
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Canceling an Registration' })
    @ApiResponse({
        description: 'Registration canceled',
        status: HttpStatus.OK
    })
    @ApiResponse({
        description: 'Registration not found',
        status: HttpStatus.NOT_FOUND
    })
    async remove(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Registration canceled',
            result: await this.registrationService.remove(id)
        }
    }
}
