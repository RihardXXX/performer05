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

  //================ Лайки к аккаунтам ==================
  // массив с айдишками клиентов и мастеров которые лайкали аккаунт
  @Column("simple-array")
  listIdLikes: number[];

  // Количество лайков которые поставили к данному аккаунту
  @Column({ default: 0 })
  countLikes: number;
  //======================================================

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  // Отношение один ко многим то один аккаунт и много заказов
  @OneToMany(() => OrdersEntity, (order) => order.user)
  orders: OrdersEntity[];

  // Отношение многие ко многим для лайков заказов
  @ManyToMany(() => OrdersEntity)
  @JoinTable()
  favorites: OrdersEntity[];
}
