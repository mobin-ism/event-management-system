import { ApiProperty } from '@nestjs/swagger'
import {
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString
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
    @IsNotEmpty()
    @IsNumber()
    maxAttendees: number
}
