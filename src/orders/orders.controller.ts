import {
  Controller,
  Post,
  UseGuards,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Delete,
} from "@nestjs/common";
import { OrdersService } from "@app/orders/orders.service";
import AuthGuard from "@app/guards/auth.guard";
import RoleGuard from "@app/guards/role.guard";
import OrderDto from "@app/orders/dto/createOrders.dto";
import { User } from "@app/decorators/user.decorator";

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Логика создания заказа
  // 1. проверка авторизации +
  // 2. Проверка на роль +
  // 3. Валидация DTO +
  // 4. Получение тела объект запроса +
  // 4. Cоздание связей +
  // 5. создание текущего заказа +
  @Post("orders")
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe())
  async createOrder(
    @User() user: any,
    @Body("order") createOrder: OrderDto
  ): Promise<any> {
    const newOrder = await this.ordersService.createOrder(user, createOrder);
    return this.ordersService.normalizeOrders(newOrder);
  }

  // логика получения заказа по слагу
  // 1. Создание функции которая нормализует получаемые данные из БД +
  // 2. Установка декоратора для получения параметра +
  // 3. По параметру сделать запрос и получить заказ +
  // 4. Полученный заказ нормализовать через опред функцию +
  @Get("orders/:slug")
  async getOrder(@Param("slug") slug: string) {
    const order = await this.ordersService.getOrderBySlug(slug);
    return this.ordersService.normalizeOrders(order);
  }

  // Удаление заказа
  // 1.Проверка пользователя на авторизацию +
  // 2.Проверка что пользователь является кастомером +
  // 3.Проверка пользователя что пользователь именно этот создал этот заказ
  // 4. Удаление статьи
  @Delete("orders/:slug")
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async deleteOrder(@Param("slug") slug: string, @User() user: any) {
    const idCurrentUser = user.id;
    return await this.ordersService.deleteOrderByslug(idCurrentUser, slug);
  }
}
