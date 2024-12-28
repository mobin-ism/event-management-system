import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Registration } from 'src/modules/registration/entities/registration.entity'
import { Column, Entity, Index, OneToMany } from 'typeorm'

@Entity()
@Index(['name', 'email'])
export class Attendee extends CustomBaseEntity {
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    name: string

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true
    })
    email: string

    @OneToMany(() => Registration, (registration) => registration.attendee, {
        cascade: true
    })
    eventAttendees: Registration[]
}
