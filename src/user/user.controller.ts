import {
  Body, Controller, Post, UsePipes, ValidationPipe, Req, Get
} from "@nestjs/common";
import { UserService } from "@app/user/user.service";
import CreateUserDto from "@app/user/dto/createUser.dto";
import LoginUserDto from "@app/user/dto/loginUser.dto";
import { UserEntity } from "@app/user/user.entity";
import { Request } from 'express';

@Controller()
export class UserController{
  constructor(private readonly userService: UserService) {
  }

  // Decorators
  //=================
  // path name "users"
  @Post('users')
  // validation body (frontend validators => backend validators https://docs.nestjs.com/pipes )
  @UsePipes(new ValidationPipe())
  //=================
  // payload json key "user"
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserEntity> {
    // создаём нового пользователя
    const user = await this.userService.createUser(createUserDto);
    // нормализуем данные для клиента а также клеим токен
    return this.userService.normalizeResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.normalizeResponse(user);
  }

  @Get('user')
  async currentUser(@Req() request: Request): Promise<any> {
    const user = request.headers.authorization;
    return  this.userService.normalizeResponse(user);
  }
}

