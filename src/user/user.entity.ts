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
import { ReviewsEntity } from "@app/reviews/reviews.entity";

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

  // Тут будет хранится массив айдишек с заблокированными аккаунтами пользователей
  @Column("simple-array", { default: "" })
  blackList: number[];

  //================ Лайки к аккаунтам ==================
  // массив с айдишками клиентов и мастеров которые лайкали аккаунт
  @Column("simple-array")
  listIdLikes: number[];

  //================ айдишки тех кто подписан на аккаунт ==================
  // массив с айдишками клиентов и мастеров которые подписаны на аккаунт
  @Column("simple-array", { default: "" })
  listIdFollows: number[];

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

  // Отношение один ко многим то один аккаунт и много отзывов
  @OneToMany(() => ReviewsEntity, (review) => review.user)
  reviews: ReviewsEntity[];

  // Отношение многие ко многим для лайков заказов
  @ManyToMany(() => OrdersEntity)
  @JoinTable()
  favorites: OrdersEntity[];
}
