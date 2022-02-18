import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import CreateUserDto from "@app/user/dto/createUser.dto";
import LoginUserDto from "@app/user/dto/loginUser.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { getRepository, Repository } from "typeorm";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import { JWT_SECRET } from "@app/config";
import { OrdersEntity } from "@app/orders/orders.entity";

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

    // Чтобы не было ошибки если вдруг не отправят массив подписчиков
    if (!newUser.listIdFollows) {
      newUser.listIdFollows = [];
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

  // Добавление пользователя в черный список
  async addUserBlackList(idBlock, currentUser) {
    // Поиск юзера по айди которого будем блокировать
    const isUserForBlocked = await this.userRepository.findOne(idBlock);

    if (!isUserForBlocked) {
      throw new HttpException(
        "Такой юзер в базе отсутствует",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    // Получаем аккаунт текущего пользователя
    const user = await this.userRepository.findOne(currentUser.id);

    // Проверка что пользователь не находился ранее в черном списке
    const isBlockedPrev = user.blackList.some(
      (id) => Number(id) === isUserForBlocked.id
    );

    if (isBlockedPrev) {
      throw new HttpException(
        "Вы ранее добавляли этого пользователя в черный список",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    // Если ранее пользователь не был добавлен в черный список то добавляем его
    user.blackList.push(idBlock);

    return await this.userRepository.save(user);
  }

  // Удаление пользователя из чёрного списка
  async deleteUserBlackList(idUnBlock, currentUser) {
    // Поиск юзера по айди которого будем разблокировать
    const isUserForUnBlocked = await this.userRepository.findOne(idUnBlock);

    if (!isUserForUnBlocked) {
      throw new HttpException(
        "Такой юзер в базе отсутствует",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    // Получаем аккаунт текущего пользователя
    const user = await this.userRepository.findOne(currentUser.id);

    // Проверка что пользователь находился ранее в черном списке
    const isBlockedPrev = user.blackList.some(id => Number(id) === isUserForUnBlocked.id);

    if (!isBlockedPrev) {
      throw new HttpException(
        "Такого пользователя нет в черном списке",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    // Если пользователь был в черном списке то удаляем его
    user.blackList = user.blackList.filter((id) => Number(id) !== isUserForUnBlocked.id);

    return await this.userRepository.save(user);
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

  // Получение информации о юзере по его айди
  async getAccountById(id) {
    return await this.userRepository.findOne(id)
  }

  // Получение списка всех мастеров
  async getAllPerformersList(role, query) {
    console.log("role:", role);
    // готовим запрос к таблице пользователей
    const queryBuilder = getRepository(UserEntity)
      .createQueryBuilder("users")

    // Сортировка пользователей по айди создания свежие сверху
    queryBuilder.orderBy("users.id", "DESC");

    // Если роль не передана
    if (!role) {
      throw new HttpException(
        "Укажите роль",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    // Поиск пользователей мастеров только
    queryBuilder
      .where("users.role = :role", {
        role,
      })

    // возвращаем количество аккаунтов
    const usersCount = await queryBuilder.getCount();

    // Пишем логику для пагинации
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    // возвращаем все заказы
    const users = await queryBuilder.getMany();
    return { users, usersCount };
  }

  normalizeInfoUser(user) {
    delete user.password;
    delete user.email;
    return {
      user: {
        ...user,
      },
    };
  }
}
