import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    Logger,
    PipeTransform
} from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    private readonly logger = new Logger(ValidationPipe.name)

    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value
        }
        const object = plainToClass(metatype, value)
        const errors = await validate(object)
        if (errors.length > 0) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'Validation Error',
                error: this.formatErrors(errors)
            })
        }
        return value
    }

    private formatErrors(errors: ValidationError[]): string {
        return errors
            .map((error) => {
                if (error.constraints) {
                    const messages = Object.values(error.constraints)
                    return `${messages.join(', ')}`
                }
                return `Invalid value`
            })
            .join('; ')
    }

    private toValidate(metatype: any): boolean {
        const types: any[] = [String, Boolean, Number, Array, Object]
        return !types.includes(metatype)
    }
}
