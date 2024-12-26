import {
    BaseEntity,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

export class CustomBaseEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4()

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
