import { Column, ManyToOne, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "@app/user/user.entity";

// имя таблицы в БД
@Entity({ name: "reviews" })
export class ReviewsEntity {
  // первичный ключ
  @PrimaryGeneratedColumn()
  id: number;

  // имя автора
  @Column()
  author: string;

  // айди автора
  @Column()
  idAuthor: number;

  // текст отзыва
  @Column()
  text: string;

  // дата создания
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  // параметр eager true важен благодаря ему вместе с отзывами приходят на кого составлен отзыв
  @ManyToOne(() => UserEntity, (user) => user.reviews, { eager: true })
  user: UserEntity;
}
