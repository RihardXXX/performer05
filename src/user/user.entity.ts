import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { hash } from 'bcrypt';

// имя таблицы в БД
@Entity({name: 'users'})
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  role: string

  @Column({default: ''})
  bio: string

  @Column()
  password: string

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
