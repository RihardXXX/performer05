import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import CreateUserDto from "@app/user/dto/createUser.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { Repository } from "typeorm";
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';

@Injectable()
export class UserService{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    // проверка на существование пользователя с такой же почтой или именем
    // ===================================================================
    const isEmailRepeat = await this.userRepository.findOne({
      email: createUserDto.email,
    })
    const isUsernameRepeat = await this.userRepository.findOne({
      username: createUserDto.username,
    })

    if (isEmailRepeat || isUsernameRepeat) {
      throw new HttpException(
        'пользователь с таким именем или почтой существует',
        HttpStatus.UNPROCESSABLE_ENTITY
      )
    }
    //==========================================================================

    const newUser = new UserEntity()
    Object.assign(newUser, createUserDto)
    return await this.userRepository.save(newUser)
  }

  generateJWT(user: UserEntity): string {
    return sign({
      id: user.id,
      username: user.username,
      email: user.email
    }, JWT_SECRET)
  }

  normalizeResponse(user: UserEntity): any {
    return {
      user: {
        ...user,
        token: this.generateJWT(user)
      }
    }
  }
}
