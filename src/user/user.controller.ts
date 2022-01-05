import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "@app/user/user.service";
import CreateUserDto from "@app/user/dto/createUser.dto";

@Controller()
export class UserController{
  constructor(private readonly userService: UserService) {
  }

  // path name "users"
  @Post('users')
  // payload json key "user"
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<any> {
    return this.userService.createUser(createUserDto);
  }
}
