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

    // Чтобы не было ошибки если вдруг не отправят массив для лайков
    if (!newUser.listIdLikes) {
      newUser.listIdLikes = [];
    }
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
  async setLikeAccount(id, currentUser) {
    const userForLike = await this.userRepository.findOne(id);
    // Если нет не одного лайка то есть у пользователя первый лайк
    if (!userForLike.listIdLikes.length) {
      // то кладём кладём айдишник того кто лайкнул и увеличиваем количество лайков
      userForLike.listIdLikes.push(currentUser.id);
      userForLike.countLikes++;
      return await this.userRepository.save(userForLike);
    }

    // Если пользователь ранее лайкал то удаляем его лайк
    const isLikedUser = userForLike.listIdLikes.some(
      (id) => Number(id) === currentUser.id
    );
    if (isLikedUser) {
      userForLike.listIdLikes = userForLike.listIdLikes.filter(
        (id) => Number(id) !== currentUser.id
      );
      userForLike.countLikes--;
      return await this.userRepository.save(userForLike);
    }

    // Если пользователь ранее не лайкал но до него лойкали другие
    const isNotLikedUser = userForLike.listIdLikes.some(
      (id) => Number(id) !== currentUser.id
    );
    if (isNotLikedUser) {
      userForLike.listIdLikes.push(currentUser.id);
      userForLike.countLikes++;
      return await this.userRepository.save(userForLike);
    }
  }

  // Определяем кто лайкал текущую анкету
  async getListUsersWhoLikesAccount(id) {
    const [accountLikes] = await Promise.all([this.userRepository.findOne(id)]);
    if (!accountLikes) {
      throw new HttpException(
        "Такой пользователь отсутствует",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    // массив с айдишками тех кто лайкал
    const listLikes = accountLikes.listIdLikes;

    if (!listLikes.length) {
      throw new HttpException(
        "Этот аккаунт ещё не лайкали",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    // В цикле создаем промиссы обращения к БД и забираем лиц кто лайкал
    const whoLikesAccounts = await Promise.all(
      listLikes.map((id) => this.userRepository.findOne(Number(id)))
    );
    return { whoLikesAccounts };
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
