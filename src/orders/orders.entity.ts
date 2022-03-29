import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";

import { UserEntity } from "@app/user/user.entity";

// имя таблицы в БД
@Entity({ name: "orders" })
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: "" })
  body: string;

  @Column({ default: "" })
  price: string;

  @Column()
  address: string;

  @Column("simple-array")
  category: string[];

  // координаты для адреса карты где нужно выолнить заказ
  @Column("simple-array", { default: "" })
  coords: string[];

  // дата выполнения работ
  @Column()
  dueDate: string;

  // время выполнения работ
  @Column()
  dueTime: string;

  // массив с айдишками мастеров которые подали заявки
  @Column("simple-array")
  listOfPerformers: string[];

  // выбран ли победитель
  @Column({ default: false })
  selectedPerformer: boolean;

  // изначальный статус заявки
  @Column({ default: "свободен" })
  status: string;

  // айдишка победителя мастер
  @Column({ default: "" })
  victory: string;

  @Column({ default: 0 })
  favoritesCount: number;

  // дата создания
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  // параметр eager true важен благодаря ему вместе с закзаами приходят и связанный с ним автор
  @ManyToOne(() => UserEntity, (user) => user.orders, { eager: true })
  user: UserEntity;
}
