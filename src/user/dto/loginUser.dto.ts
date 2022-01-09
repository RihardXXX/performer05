import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";


export default class loginUserDto {

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
  @MinLength(10, {
    message: 'Пароль должен быть больше 10 символов',
  })
  @MaxLength(100, {
    message: 'Пароль должен быть меньше 100 символов',
  })
  readonly password: string;

}
