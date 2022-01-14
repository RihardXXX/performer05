import {
  BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany
} from "typeorm";
import { hash } from 'bcrypt';
import { OrdersEntity } from "@app/orders/orders.entity";

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

  @Column({select: false})
  password: string

  @OneToMany(() => OrdersEntity, order => order.user)
  orders: OrdersEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
