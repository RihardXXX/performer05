import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Patch,
  Param,
  Delete,
  Query,
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
  // 1. Проверка авторизации +
  // 2. Получение id аккаунта который будем лайкать +
  // 3. Получение id пользователя который будет лайкать +
  // 4. Проверка в массиве ранее отлайканных чтобы второй раз не мог лайкать +
  // 5. Если второй раз хочет лайкать то сделать дизлайк +
  @Post("user/:id/like")
  @UseGuards(AuthGuard)
  async setLikeAccount(@Param("id") id: string, @User() currentUser: any) {
    return await this.userService.setLikeAccount(id, currentUser);
  }

  // Получение списка пользователей кто лайкал определенный аккаунт
  // 1. Проверка авторизации +
  // 2. Получение айди аккаунта который лайкали, из квери параметров
  // 3. Поиск Аккаунта по ауди
  // 4. Получение у текущего аккаунта из списка массива айдишек людей кто лайкал
  // 5. Запрос к БД для получения всех пользователей кто лайкал
  // 6. Упаковка всех пользователей в массив и вовзрат у нужном формате
  @Get("users/who/likes/account/:id")
  @UseGuards(AuthGuard)
  async getListUsersWhoLikesAccount(@Param("id") id: string) {
    return this.userService.getListUsersWhoLikesAccount(id);
  }

  // Добавление пользователя в чёрный список
  // Проверка авторизации +
  // Получение айди из параметров пользователя которого хотим добавить в яерный список +
  // Проверка в БД что по такому айди пользователь существует +
  // Получение Записи у текущего пользователя +
  // Проверка того что данный айдишник не находится в черном списке +
  // Добавление пользователя в черный список +
  @Patch("users/black/list/account/:id")
  @UseGuards(AuthGuard)
  async addUserBlackList(
    @Param("id") idBlock: string,
    @User() currentUser: any
  ) {
    return this.userService.addUserBlackList(idBlock, currentUser);
  }

  // Удаление пользователя из черного списка
  // Проверка авторизации +
  // Получение айди из параметров пользователя которого хотим удалить из черного списка +
  // Проверка в БД что по такому айди пользователь существует +
  // Получение Записи у текущего пользователя +
  // Проверка того что данный айдишник находится в черном списке +
  // Удаление пользователя из чёрного списка +
  @Delete("users/black/list/account/:id")
  @UseGuards(AuthGuard)
  async deleteUserBlackList(
    @Param("id") idUnBlock: string,
    @User() currentUser: any
  ) {
    return this.userService.deleteUserBlackList(idUnBlock, currentUser);
  }

  // Получение данных юзера по его айди
  // 1. Проверка авторизации
  // 2. Получение юзера из БД по его айди
  // 3. Нормализация полученных данных и удаление лишней информации
  @Get("users/:id")
  @UseGuards(AuthGuard)
  async getAccountById(@Param("id") id: string) {
    const user = await this.userService.getAccountById(id);
    return this.userService.normalizeInfoUser(user);
  }

  // Получение списка всех мастеров с пагинацией
  // 1. Проверка авторизации +
  // 2. Получение списка всех мастеров и клиентов +
  // 3. Удаление из найденных элементов конфиденциональной информации +
  // 4. Вернуть в виде объекта внутри которого массив +
  @Get("users/role/:role")
  @UseGuards(AuthGuard)
  async getAllPerformersList(@Param("role") role: string, @Query() query: any) {
    return this.userService.getAllPerformersList(role, query);
  }

  // Подписка и отписка от аккаунта
  // 1. Проверка авторизации +
  // 2. Получение в параметрах текущего пользователя +
  // 3. Получение в параметрах айди того пользователя к кому мы подписываемся +
  // 4. Если айди текущего пользователя совпалает с айди аккаунта то выбрасываем ошибку +
  // 5. Находим пользователя по айди
  // 6. Делаем проверку если ли айди текущего пользователя в массиве айдишек у найденного пользователя
  // 7. Если айди уже существует то удаляем его из массива иначе добавляем в массив
  // 8. Возвращаем статус подписка и текущего пользователя
  @Get("users/follow/:id")
  @UseGuards(AuthGuard)
  async setFollowAccount(@Param("id") id: string, @User() currentUser: any) {
    return this.userService.setFollowAccount(id, currentUser);
  }

  // Получение списка аккаунтов на которые я подписан
  // 1. Проверка авторизации +
  // 2. Получение в параметрах текущего пользователя +
  // 3. Подготовка запроса и создание квери для базы
  // 4. Сортировка по самым свежим
  // 5. Проверка чтобы массив с айдишками не был пустым
  // 6. Сопоставление айди текущего пользователя с айди внутри масива с подписками
  // 7. Возвращаем всех пользователей после сортировки
  // 7. Создаём пагинацию
  // 7. Возвращаем количество найденных и сами акаунты
  @Get("users/list/my/follow")
  @UseGuards(AuthGuard)
  async getAllAccountsFollows(@User() currentUser: any, @Query() query: any) {
    return this.userService.getAllAccountsFollows(currentUser, query);
  }
}
