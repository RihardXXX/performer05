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
  Put,
  Patch,
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

  // Обновление статьи
  // 1. Проверка на авторизацию +
  // 2. Проверка на роль +
  // 3. Проверка на авторство
  // 4. Валидация как и при создании заказа но с другим именем +
  // 5. Обновление всех полей
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Put("orders/:slug")
  async updateOrder(
    @Param("slug") slug: string,
    @User() user: any,
    @Body("order") updateOrder: OrderDto
  ) {
    const newOrder = await this.ordersService.updateOrderBySlug(
      slug,
      user,
      updateOrder
    );

    return this.ordersService.normalizeOrders(newOrder);
  }

  // Подача заявки на заказ от имени Перформера
  // 1. Проверка авторизации +
  // 2. Получение заказа на который подаётся заявка +
  // 3. Получение данных юзера +
  // 4. Проверка его роли что он перформер +
  // 5. Проверка заказа на наличие победителя, что нет победителя +
  // 6. Проверка что ранее вы не подавали заявку на этот заказ +
  // 7. Добавление айди Перформера в заказ +
  @UseGuards(AuthGuard)
  @Patch("orders/:slug/submit")
  async submitApplicationOnOrder(
    @Param("slug") slug: string,
    @User() user: any
  ) {
    const order = await this.ordersService.submitApplicationOnOrderBySlug(
      slug,
      user
    );
    return this.ordersService.normalizeOrders(order);
  }

  // Определение победителя по заказу
  // 1. Проверка авторизации
  // 2. Проверка наличия заказа
  // 3. Проверка на роль
  // 4. Проверка что тот кто обращается с запросом является автором
  // 5. Сравнение что айди в запросе совпадает с айди из списка листперформеров
  // 6. Очистка списка листперформеров
  // 7. Заполнение поля селектед перформер тру что победитель выбран
  // 8. Положить айди победителя в раздел виктори заказа
}
