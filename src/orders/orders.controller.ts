import { Controller, Post, UseGuards, Body, UsePipes, ValidationPipe } from "@nestjs/common";
import { OrdersService } from "@app/orders/orders.service";
import AuthGuard from "@app/guards/auth.guard";
import RoleGuard from "@app/guards/role.guard";
import OrderDto from "@app/orders/dto/createOrders.dto"
import { User } from "@app/decorators/user.decorator";
import { UserEntity } from "@app/user/user.entity";

@Controller()
export class OrdersController{
  constructor(private readonly ordersService: OrdersService) {
  }

  // Логика создания заказа
  // 1. проверка авторизации +
  // 2. Проверка на роль +
  // 3. Валидация DTO +
  // 4. Получение тела объект запроса +
  // 4. Cоздание связей +
  // 5. создание текущего заказа +
  @Post('orders')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  async createOrder(
    @User() user: any,
    @Body('order') createOrder: OrderDto,
    ): Promise<any> {
    return this.ordersService.createOrder(user, createOrder);
  }
}
