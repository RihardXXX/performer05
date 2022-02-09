import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
} from "@nestjs/common";
import AuthGuard from "@app/guards/auth.guard";
import RoleGuard from "@app/guards/role.guard";
import { ReviewsService } from "@app/reviews/reviews.service";
import CreateReviewDto from "@app/reviews/dto/createReview.dto";

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Создание отзыва по аккаунту
  // 1. Проверка авторизации +
  // 2. Получение айди юзера кому оставляем отзыв +
  // 3. Получение текста отзыва +
  // 4. Валидация текста отзыва +
  // 5. По айди находим юзера на кого оставляем отзыв +
  // 6. Создаем Модель ентити отзыва
  // 7. Мерждим ДТО с Моделью отзыва
  // 8. Устанавливаем Автора отзыва и его айди в модель отзыва
  // 9. В модели отзыва устанавливаем связь и кладём найденного юзера по айди на кого оставляем отзыв
  // 10. Сохраняем в БД отзыв
  @Post("reviews")
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createReviewAccount(@Body("review") createReview: CreateReviewDto) {
    return await this.reviewsService.createReviewAccount(createReview);
  }
  // Получение списка отзывов по текущему аккаунту
}
