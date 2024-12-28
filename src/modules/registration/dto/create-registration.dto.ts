import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreateRegistrationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    eventId: string

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    attendeeId: string
}
