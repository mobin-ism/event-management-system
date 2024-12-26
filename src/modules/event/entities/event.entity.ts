import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Column, Entity, Unique } from 'typeorm'

@Entity()
@Unique(['location', 'date'])
export class Event extends CustomBaseEntity {
    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    name: string

    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @Column({ type: 'timestamptz' }) // Recommended
    date: Date

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    location: string

    @Column({
        type: 'int',
        nullable: false,
        default: 0
    })
    maxAttendees: number
}
