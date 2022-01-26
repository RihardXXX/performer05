import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import CreateUserDto from "@app/user/dto/createUser.dto";
import LoginUserDto from "@app/user/dto/loginUser.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { Repository } from "typeorm";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import { JWT_SECRET } from "@app/config";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    // проверка на существование пользователя с такой же почтой или именем
    // ===================================================================
    const isEmailRepeat = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    const isUsernameRepeat = await this.userRepository.findOne({
      username: createUserDto.username,
    });

    if (isEmailRepeat || isUsernameRepeat) {
      throw new HttpException(
        "пользователь с таким именем или почтой существует",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
    //==========================================================================

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    // Проверка на наличие почты в базе данных
    const isUser = await this.userRepository.findOne(
      {
        email: loginUserDto.email,
      },
      {
        // возвращаемые значение обязательные поля
        select: ["id", "username", "email", "password", "role", "bio"],
      }
    );

    // console.log('isUser: ', isUser);

    if (!isUser) {
      throw new HttpException(
        "пользователь с такой почтой отсуствует",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    // сравниваем пароль веденный с хешем найденного пользователя с БД
    const isPassword = await compare(loginUserDto.password, isUser.password);

    if (!isPassword) {
      throw new HttpException(
        "пароль введён неверный",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    delete isUser.password;

    return isUser;
  }

  // получение опред пользователя по id
  getUserById(id: number): Promise<any> {
    return this.userRepository.findOne(id);
  }

  // генерация токена
  generateJWT(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET
    );
  }

  // Лайк Анкеты мастера или клиента
  async setLikeAccount(idUser, currentUser) {
    console.log("idUser", idUser);
    console.log("currentUser", currentUser);
    return "ok";
  }

  // Цепляем токен к данным пользователя
  normalizeResponse(user): any {
    delete user.password;
    return {
      user: {
        ...user,
        token: this.generateJWT(user),
      },
    };
  }

  // метод для обновления полей юзера
  async updateUserState(user, payload) {
    const id = user.id;
    // получаем текущего юзера с базы
    const updatedUser = await this.getUserById(id);
    // обновляем его состояние
    const newUser = {
      ...updatedUser,
      ...payload,
    };
    // сохраняем юзера с обновлённым состоянием в базе
    return await this.userRepository.save(newUser);
  }
}
