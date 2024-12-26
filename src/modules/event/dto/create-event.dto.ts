import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateEventDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string

    @ApiProperty()
    @IsNotEmpty()
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
