import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import OrderDto from "@app/orders/dto/createOrders.dto";
import { OrdersEntity } from "@app/orders/orders.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class OrdersService {
  // чтобы можно было работать в базе с сущностью данной модели
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>
  ) {}

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
