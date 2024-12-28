import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Registration } from 'src/modules/registration/entities/registration.entity'
import { Column, Entity, Index, OneToMany, Unique } from 'typeorm'

@Entity()
@Unique(['location', 'date'])
@Index(['location', 'date'])
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

    @Column({
        type: 'date', // This stores date only, without time
        nullable: false
    })
    date: Date

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    location: string

    @Column({
        type: 'int',
        unsigned: true,
        nullable: false,
        default: 1
    })
    maxAttendees: number

    @OneToMany(() => Registration, (registration) => registration.event, {
        cascade: true
    })
    eventAttendees: Registration[]
}
