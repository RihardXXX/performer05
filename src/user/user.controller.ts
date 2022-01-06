import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "@app/user/user.service";
import CreateUserDto from "@app/user/dto/createUser.dto";
import { UserEntity } from "@app/user/user.entity";

@Controller()
export class UserController{
  constructor(private readonly userService: UserService) {
  }

  // path name "users"
  @Post('users')
  // payload json key "user"
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserEntity> {
    // получаем из базы нового пользователя
    const user = await this.userService.createUser(createUserDto);
    // нормализуем данные для клиента а также клеим токен
    return this.userService.normalizeResponse(user);
  }
}
