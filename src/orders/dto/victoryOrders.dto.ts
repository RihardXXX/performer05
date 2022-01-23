import { IsNotEmpty, MinLength, MaxLength } from "class-validator";

// запрос победителя тело
export default class VictoryOrdersDto {
  @IsNotEmpty({
    message: "поле айди перформера не может быть пустым",
  })
  @MinLength(1, {
    message: "айди перформреа быть больше 1 символа",
  })
  @MaxLength(30, {
    message: "айди перформера быть не больше 30 символов",
  })
  readonly idPerformer: string;

  @IsNotEmpty({
    message: "поле слаг заказа не может быть пустым",
  })
  @MinLength(1, {
    message: "слаг заказа быть больше 1 символа",
  })
  @MaxLength(30, {
    message: "слаг заказа не больше 30 символов",
  })
  readonly slugOrder: string;
}
