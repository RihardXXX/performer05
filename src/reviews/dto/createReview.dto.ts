import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export default class CreateReviewDto {
  @IsNotEmpty({
    message: "поле отзыва не может быть пустым",
  })
  @MinLength(10, {
    message: "отзыв должен быть больше 10 символов",
  })
  @MaxLength(200, {
    message: "отзыв должен быть не больше 200 символов",
  })
  readonly text: string;

  @IsNotEmpty({
    message: "айди автора отзыва не может быть пустым",
  })
  readonly idAuthor: number;

  @IsNotEmpty({
    message: "имя автора должно быть заполненно",
  })
  readonly author: string;

  @IsNotEmpty({
    message: "айди аккаунта кому оставляем отзыв не может быть пустым",
  })
  readonly idAccount: number;
}
