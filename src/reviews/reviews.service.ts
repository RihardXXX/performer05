import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ReviewsEntity } from "@app/reviews/reviews.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewsEntity)
    private readonly reviewRepository: Repository<ReviewsEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  // Метод создающий отзывы
  async createReviewAccount(createReviews) {
    // Внимание тут в будущем создать метод чтобы отзывы не могли оставлять кто в черном списке

    // Айди пользователя на кого оставляем отзыв и айди автора отзыва
    const { idAccount, idAuthor } = createReviews;

    // достаем аккаунт на кого оставляем отзыв
    const accountForReviews = await this.userRepository.findOne({
      id: idAccount,
    });

    // Достаем автора отзыва из БД проверяем есть ли такой автор
    const authorReview = await this.userRepository.findOne({
      id: idAuthor,
    });

    if (!accountForReviews) {
      throw new HttpException(
        "Пользователя с таким айди не существует",
        HttpStatus.NOT_FOUND
      );
    }

    if (!authorReview) {
      throw new HttpException(
        "Пользователя с таким айди не существует, вы не можете быть автором",
        HttpStatus.NOT_FOUND
      );
    }

    // Удаляем айди на какой оставляем отзыв
    delete createReviews.idAccount;

    // Создаём модель для отзыва
    const review = new ReviewsEntity();

    // мёерджим данные из ДТО
    Object.assign(review, createReviews);

    // Создаём свзять один ко многим цепляем отзыв к опреденному аккаунту
    review.user = accountForReviews;

    // создаём отзыв в БД
    const newReview = await this.reviewRepository.save(review);

    // возвращаем объект с отзывом
    return {
      review: newReview,
    };
  }
}
