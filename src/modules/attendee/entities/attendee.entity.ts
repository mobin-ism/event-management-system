import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Column, Entity, Index } from 'typeorm'

@Entity()
@Index(['email'])
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
}
