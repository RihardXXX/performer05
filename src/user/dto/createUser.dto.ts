import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

// Эта штука нужна для анализы схемы полученных банных body  с фронта до контроллера и сервиса
export default class createUserDto {

  @IsNotEmpty({
    message: 'поле имя пользователя не может быть пустым'
  })
  @MinLength(6, {
    message: 'Имя должно быть больше 6 символов',
  })
  @MaxLength(20, {
    message: 'Имя должно быть больше не больше 20 символов',
  })
  readonly username: string;

  @IsNotEmpty({
    message: 'поле почты пользователя не может быть пустым'
  })
  @IsEmail({}, {
    message: 'Введите корректный формат почты'
  })
  readonly email: string;

  @IsNotEmpty({
    message: 'поле пароль не может быть пустым'
  })
  readonly password: string;

  @IsNotEmpty()
  readonly role: string;

  readonly bio: string;
}
