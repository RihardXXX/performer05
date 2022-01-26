import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import OrderDto from "@app/orders/dto/createOrders.dto";
import { OrdersEntity } from "@app/orders/orders.entity";
import { getRepository, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import { UserEntity } from "@app/user/user.entity";

@Injectable()
export class OrdersService {
  // чтобы можно было работать в базе с сущностью данной модели
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  // Получение списка заказов
  async getOrderList(user, query) {
    // готовим запрос к таблице заказов
    const queryBuilder = getRepository(OrdersEntity)
      .createQueryBuilder("orders")
      .leftJoinAndSelect("orders.user", "user"); // получаем авторов заказа

    // Сортировка заказов по дате создания свежие сверху
    queryBuilder.orderBy("orders.createdAt", "DESC");

    // Поиск по категории, важно то что мы ищет и подстроку благодря проценту
    if (query.category) {
      queryBuilder.andWhere("orders.category LIKE :category", {
        category: `%${query.category}%`,
      });
    }

    // Поиск по ключевой фразе в названии
    // То есть если в имени описании или в теле заказа присутствует это слово
    if (query.name) {
      queryBuilder.orWhere("orders.title LIKE :title", {
        title: `%${query.name}%`,
      });
      queryBuilder.orWhere("orders.description LIKE :description", {
        description: `%${query.name}%`,
      });
      queryBuilder.orWhere("orders.body LIKE :body", {
        body: `%${query.name}%`,
      });
    }

    // Поиск заказа по автору
    if (query.username) {
      // находим юзера в Базе БД
      const user = await this.userRepository.findOne({
        username: query.username,
      });

      // если нет такого автора по имени автора выдаём ошибку
      if (!user) {
        throw new HttpException(
          "автора заказа с таким именем не существует",
          HttpStatus.NOT_FOUND
        );
      }

      // далее фильтрируем заказы по автору
      queryBuilder.andWhere("orders.userId = :id", {
        id: user.id,
      });
    }

    // возвращаем количество заказов
    const ordersCount = await queryBuilder.getCount();

    // Пишем логику для пагинации
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    // возвращаем все заказы
    const orders = await queryBuilder.getMany();
    return { orders, ordersCount };
  }

  // Создание заказа
  async createOrder(user: any, createOrder: OrderDto) {
    // Создаём сущность для заказа
    const order = new OrdersEntity();
    // Записываем в пустую сущность данные из DTO
    Object.assign(order, createOrder);

    // Чтобы не было ошибки если вдруг не отправят категорию
    if (!order.category) {
      order.category = [];
    }

    // Чтобы не было ошибки если вдруг не отправят массива выбранного исполнителя
    if (!order.listOfPerformers) {
      order.listOfPerformers = [];
    }

    // генерация слага
    order.slug = this.generateSLug(createOrder.title);

    // кладём согласно связи один ко многим в заказ юзера
    order.user = user;
    // сохраняем заказ в БД
    return await this.orderRepository.save(order);
  }

  // получение заказа по слагу
  async getOrderBySlug(slug) {
    return await this.orderRepository.findOne({ slug });
  }

  // Удаление заказа если пользователь является его автором
  async deleteOrderByslug(idCurrentUser, slug): Promise<any> {
    // находим заказ по слагу
    const order = await this.getOrderBySlug(slug);

    if (!order) {
      throw new HttpException("такой заказ не найден", HttpStatus.NOT_FOUND);
    }

    // Если заказ пытается удалить не её автор
    if (order.user.id !== idCurrentUser) {
      throw new HttpException(
        "вы не являетесь автором данного заказа чтобы удалять его",
        HttpStatus.FORBIDDEN
      );
    }

    // если проверки пройдены то удаляем заказ
    return await this.orderRepository.delete({ slug });
  }

  // обновление заказа в БД
  async updateOrderBySlug(slug, user, updateOrder): Promise<any> {
    // находим заказ по слагу
    const order = await this.getOrderBySlug(slug);

    if (!order) {
      throw new HttpException("такой заказ не найден", HttpStatus.NOT_FOUND);
    }

    const idCurrentUser = user.id;
    // Если заказ пытается обновить не её автор
    if (order.user.id !== idCurrentUser) {
      throw new HttpException(
        "вы не являетесь автором данного заказа чтобы удалять его",
        HttpStatus.FORBIDDEN
      );
    }

    // В найденный заказ по слагу перезаписываем новые данные
    Object.assign(order, updateOrder);
    return this.orderRepository.save(order);
  }

  // Метод который кладет айди перформера в заказ эта подача заявки
  async submitApplicationOnOrderBySlug(slug, user) {
    // находим заказ по слагу
    const order = await this.getOrderBySlug(slug);

    // то что такой заказ существует
    if (!order) {
      throw new HttpException("такой заказ не найден", HttpStatus.NOT_FOUND);
    }

    // То что роль подающего заявку является перформером
    if (user.role !== "performer") {
      throw new HttpException(
        "заказ на выполнение работ могут подавать только мастера",
        HttpStatus.CONFLICT
      );
    }

    // Проверка что победитель еще не выбран если есть победитель то выдаём ошибку
    if (order.victory && order.selectedPerformer) {
      throw new HttpException(
        "По данному заказу уже выбран победитель и работа выполняется",
        HttpStatus.CONFLICT
      );
    }

    const idPerformer = user.id;
    // Проверка на то что что ранее вы подавали заявку
    const repeatId = order.listOfPerformers.some(
      (elem) => String(idPerformer) === elem
    );
    if (repeatId) {
      throw new HttpException(
        "Вы ранее подавали заявку на этот заказ",
        HttpStatus.CONFLICT
      );
    }

    // Айдишник перформера надо положить в список айдишников в заказе
    // для того чтобы кастомер выбрал
    order.listOfPerformers.push(String(idPerformer));

    return this.orderRepository.save(order);
  }

  // Выбираем победителя и кладёем его айди в заказ победителей
  async selectVictoryPerformerById(user, victoryOrders) {
    // получение текущего заказа
    const slug = victoryOrders.slugOrder;
    const idPerformer = victoryOrders.idPerformer;
    const order = await this.getOrderBySlug(slug);

    // console.log(user.role);

    // То что роль того кто делает победитель является кастомер
    if (user.role !== "customer") {
      throw new HttpException(
        "победителя может назначить только клиент",
        HttpStatus.CONFLICT
      );
    }

    // Если заказ пытается обновить не её автор
    if (order.user.id !== user.id) {
      throw new HttpException(
        "вы не являетесь автором данного заказа чтобы выбирать победителя",
        HttpStatus.FORBIDDEN
      );
    }

    // Проверка что айди перформормера в запросе совпадает с айди ранее поданных в заказе
    const checkId = order.listOfPerformers.some((id) => id === idPerformer);
    if (!checkId) {
      throw new HttpException(
        "такой айди отсутствует отсутствует в ранее поданных в заказе",
        HttpStatus.FORBIDDEN
      );
    }

    // проверка что победитель ещё не назначен
    if (order.victory) {
      throw new HttpException("победитель уже назначен", HttpStatus.FORBIDDEN);
    }

    // Устанавливаем что статус победителя выбран и заказ в работе
    // Очищаем массив айдишников
    // кладём айди победителя
    order.selectedPerformer = true;
    order.status = "в работе";
    order.listOfPerformers = [];
    order.victory = String(idPerformer);

    return await this.orderRepository.save(order);
  }

  // Установка лайков для заказов
  async addFavoritesOrder(currentUser, slug) {
    const id = currentUser.id;
    // Получение заказа
    const order = await this.getOrderBySlug(slug);
    // Получение пользователя с зависимостями
    const user = await this.userRepository.findOne(id, {
      relations: ["favorites"],
    });

    // проверка залайкан ли заказ
    const isNotFavorited =
      user.favorites.findIndex(
        (orderInFavorites) => orderInFavorites.id === order.id
      ) === -1;

    if (isNotFavorited) {
      user.favorites.push(order);
      order.favoritesCount++;
      await this.userRepository.save(user);
      await this.orderRepository.save(order);
    }
    return order;
  }

  // Установка дизлайков для заказов
  async deleteFavoritesOrder(currentUser, slug) {
    const id = currentUser.id;
    // Получение заказа
    const order = await this.getOrderBySlug(slug);
    // Получение пользователя с зависимостями
    const user = await this.userRepository.findOne(id, {
      relations: ["favorites"],
    });

    // индекс заказа лайкнутого получаем
    const indexOrder = user.favorites.findIndex(
      (orderInFavorites) => orderInFavorites.id === order.id
    );

    // если заказ залайкан то убираем лайк
    if (indexOrder >= 0) {
      user.favorites.splice(indexOrder, 1);
      order.favoritesCount--;
      await this.userRepository.save(user);
      await this.orderRepository.save(order);
    }

    return order;
  }

  // генарация слага
  generateSLug(title) {
    return `${slugify(title, { lower: true, trim: true })}-${uuidv4().split(
      "-",
      1
    )}`;
  }

  // нормализация данных для клиента
  normalizeOrders(order) {
    return {
      order: {
        ...order,
      },
    };
  }
}
