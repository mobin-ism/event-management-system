import { ApiProperty } from '@nestjs/swagger'
import {
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min
} from 'class-validator'

export class CreateEventDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string

    @ApiProperty({
        example: '2024-12-25',
        description: 'Event date (YYYY-MM-DD)',
        type: String,
        format: 'date'
    })
    @IsNotEmpty()
    @IsDateString({ strict: true })
    date: Date

    @ApiProperty()
    @IsString()
    @IsOptional()
    location: string

    @ApiProperty()
    @IsNotEmpty({
        message:
            'Max Attendees is required and must be a positive integer greater than 0.'
    })
    @IsInt({
        message: 'Max Attendees must be a positive integer greater than 0.'
    })
    @Min(1, {
        message: 'Max Attendees must be a positive integer greater than 0.'
    })
    maxAttendees: number
}
