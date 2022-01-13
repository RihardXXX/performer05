import { Controller, Post } from "@nestjs/common";
import { OrdersService } from "@app/orders/orders.service";

@Controller()
export class OrdersController{
  constructor(private readonly ordersService: OrdersService) {
  }

  // Логика создания заказа
  // 1. проверка авторизации
  // 2. Проверка на роль
  // 3. Валидация DTO
  // 4. Cоздание связей
  // 5. создание текущего заказа
  @Post('orders')
  async createOrder() {
    return this.ordersService.createOrder();
  }
}
