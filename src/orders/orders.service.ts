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
    // if (!order.slug) {
    //   throw new HttpException(
    //     "заказ с таким номером отсутствует",
    //     HttpStatus.UNPROCESSABLE_ENTITY
    //   );
    // }
    // return order;
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
