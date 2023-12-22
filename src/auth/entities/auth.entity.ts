import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("text")
    name: string;

    @Column("text", {
        unique: true
    })
    email: string;

    @Column("text", {
        select: false
    })
    password: string;

    @Column("boolean", {
        default: false
    })
    isActive: boolean;

    @Column("text", {
        array: true,
        default: ['consumidor']
    })
    roles: string[];

    @BeforeInsert()
    checkField() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldUpdate() {
        this.email = this.email.toLowerCase().trim();
    }
}
