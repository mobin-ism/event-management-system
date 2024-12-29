import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Attendee } from 'src/modules/attendee/entities/attendee.entity'
import { Event } from 'src/modules/event/entities/event.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

@Entity()
export class Registration extends CustomBaseEntity {
    @Column('uuid')
    eventId: string

    @ManyToOne(() => Event, (event) => event.eventAttendees, {
        onDelete: 'CASCADE'
    })
    event: Event

    @Column('uuid')
    attendeeId: string

    @ManyToOne(() => Attendee, (attendee) => attendee.registrations, {
        onDelete: 'CASCADE'
    })
    attendee: Attendee

    @Column({
        type: 'date', // This stores date only, without time
        nullable: false
    })
    registeredAt: Date
}
