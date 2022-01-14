import { Controller, Post, UseGuards, Body, UsePipes, ValidationPipe } from "@nestjs/common";
import { OrdersService } from "@app/orders/orders.service";
import AuthGuard from "@app/guards/auth.guard";
import RoleGuard from "@app/guards/role.guard";
import OrderDto from "@app/orders/dto/createOrders.dto"

@Controller()
export class OrdersController{
  constructor(private readonly ordersService: OrdersService) {
  }

  // Логика создания заказа
  // 1. проверка авторизации +
  // 2. Проверка на роль +
  // 3. Валидация DTO +
  // 4. Получение тела объект запроса
  // 4. Cоздание связей
  // 5. создание текущего заказа
  @Post('orders')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  async createOrder(@Body('order') createOrder: OrderDto) {
    return this.ordersService.createOrder(createOrder);
  }
}
