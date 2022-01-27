import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Req,
  Get,
  UseGuards,
  Patch,
  Param,
} from "@nestjs/common";
import { UserService } from "@app/user/user.service";
import CreateUserDto from "@app/user/dto/createUser.dto";
import LoginUserDto from "@app/user/dto/loginUser.dto";
import { UserEntity } from "@app/user/user.entity";
import AuthGuard from "@app/guards/auth.guard";
import { User } from "@app/decorators/user.decorator";
import UpdateUserDto from "@app/user/dto/updateUser.dto";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Decorators
  //=================
  // path name "users"
  @Post("users")
  // validation body (frontend validators => backend validators https://docs.nestjs.com/pipes )
  @UsePipes(new ValidationPipe())
  //=================
  // payload json key "user"
  async createUser(
    @Body("user") createUserDto: CreateUserDto
  ): Promise<UserEntity> {
    // создаём нового пользователя
    const user = await this.userService.createUser(createUserDto);
    // нормализуем данные для клиента а также клеим токен
    return this.userService.normalizeResponse(user);
  }

  @Post("users/login")
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body("user") loginUserDto: LoginUserDto
  ): Promise<UserEntity> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.normalizeResponse(user);
  }

  // 1. Запрос от клиента -
  // 2. Мидлваре Проверка токена в заголовках -
  // 3. Гуард кастомный Авториз или нет возвращает булеан -
  // 4. Декоратор кастомный вытаскивает данные из заговловка
  // 5. Сервис нормализует данные и возвращает данные пользователя

  @Get("user")
  @UseGuards(AuthGuard)
  async currentUser(@User() user: any): Promise<any> {
    return this.userService.normalizeResponse(user);
  }

  // метод для обновления состояния пользователя
  // 1. Проверить авторизацию через гуарды +
  // 2. Через бади создать новое dto +
  // 3. Получить через декоратор текущего пользователя +
  // 4. Получить данные через +
  // 5. Создать метод внутри сервиса который будет обновлять пользователя +
  @Patch("user")
  @UseGuards(AuthGuard)
  async updateUser(
    @User() user: any,
    @Body("user") payload: UpdateUserDto
  ): Promise<any> {
    const updatedUser = await this.userService.updateUserState(user, payload);
    return this.userService.normalizeResponse(updatedUser);
  }

  // Установка лайков к анкете клиента или мастера
  // 1. Проверка авторизации
  // 2. Получение id аккаунта который будем лайкать
  // 3. Получение id пользователя который будет лайкать
  // 4. Проверка в массиве ранее отлайканных чтобы второй раз не мог лайкать
  // 5. Если второй раз хочет лайкать то сделать дизлайк
  @Post("user/:id/like")
  @UseGuards(AuthGuard)
  async setLikeAccount(@Param("id") id: string, @User() currentUser: any) {
    return await this.userService.setLikeAccount(id, currentUser);
  }
}
