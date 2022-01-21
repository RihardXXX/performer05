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
