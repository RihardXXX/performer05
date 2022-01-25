import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { hash } from "bcrypt";
import { OrdersEntity } from "@app/orders/orders.entity";

// имя таблицы в БД
@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  role: string;

  @Column({ default: "" })
  bio: string;

  @Column({ select: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => OrdersEntity, (order) => order.user)
  orders: OrdersEntity[];

  @ManyToMany(() => OrdersEntity)
  @JoinTable()
  favorites: OrdersEntity[];
}
