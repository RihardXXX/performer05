import { Injectable } from "@nestjs/common";
import { UserEntity } from "@app/user/user.entity";
import OrderDto from "@app/orders/dto/createOrders.dto";
import { OrdersEntity } from "@app/orders/orders.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class OrdersService {

  // чтобы можно было работать в базе с сущностью данной модели
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>
  ) {
  }

  async createOrder(user: any, createOrder: OrderDto) {
    // Создаём сущность для заказа
    const order = new OrdersEntity();
    // Записываем в пустую сущность данные из DTO
    Object.assign(order, createOrder);

    // Чтобы не было ошибки если вдруг не отправят категорию
    if (!order.category) {
      order.category = []
    }

    // Чтобы не было ошибки если вдруг не отправят категорию
    if (!order.listOfPerformers) {
      order.listOfPerformers = []
    }

    // чтобы не было ошибок
    order.slug = 'bar';

    // кладём согласно связи один ко многим в заказ юзера
    order.user = user;
    // сохраняем заказ в БД
    return await this.orderRepository.save(order);
  }
}
