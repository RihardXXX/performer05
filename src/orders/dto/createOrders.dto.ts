import { IsNotEmpty, MinLength, MaxLength } from "class-validator";

// Обработка тела
export default class orderDto {
  //==========
  @IsNotEmpty({
    message: "поле название заказа не может быть пустым",
  })
  @MinLength(5, {
    message: "Название заказа быть больше 5 символов",
  })
  @MaxLength(30, {
    message: "Название заказа не больше 30 символов",
  })
  readonly title: string;
  //=============

  //=============
  @IsNotEmpty({
    message: "поле описание заказа не может быть пустым",
  })
  @MinLength(5, {
    message: "Описание заказа быть больше 5 символов",
  })
  @MaxLength(200, {
    message: "Описание заказа не больше 200 символов",
  })
  readonly description: string;
  //==============

  //=============
  // @MaxLength(1000, {
  //   message: 'Основная информация заказа не больше 1000 символов',
  // })
  readonly body: string;
  //============

  //==============
  @IsNotEmpty({
    message: "поле цена заказа не может быть пустым",
  })
  @MinLength(1, {
    message: "Цена заказа быть больше 1 символов",
  })
  @MaxLength(40, {
    message: "Цена заказа не больше 40 символов",
  })
  readonly price: string;
  //==============

  //============
  @IsNotEmpty({
    message: "поле адрес не может быть пустым",
  })
  @MinLength(5, {
    message: "Адрес заказа быть больше 5 символов",
  })
  @MaxLength(200, {
    message: "Адрес заказа не больше 200 символов",
  })
  readonly address: string;
  //============

  //===========
  @IsNotEmpty({
    message: "поле категория не может быть пустым",
  })
  readonly category?: string[];
  //===========

  //==========
  @IsNotEmpty({
    message: "поле день выполнения заказа не может быть пустым",
  })
  readonly dueDate: string;
  //===========

  //==========
  @IsNotEmpty({
    message: "поле время выполнения заказа не может быть пустым",
  })
  readonly dueTime: string;
  //============
}
