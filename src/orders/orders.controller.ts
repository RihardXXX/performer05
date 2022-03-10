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
  Query,
} from "@nestjs/common";
import { OrdersService } from "@app/orders/orders.service";
import AuthGuard from "@app/guards/auth.guard";
import RoleGuard from "@app/guards/role.guard";
import OrderDto from "@app/orders/dto/createOrders.dto";
import { User } from "@app/decorators/user.decorator";
import VictoryOrdersDto from "@app/orders/dto/victoryOrders.dto";

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Логика получения списка заказов
  @Get("orders/list")
  async getOrderList(@User() user: any, @Query() query: any) {
    return this.ordersService.getOrderList(user, query);
  }

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
  // 1. Проверка авторизации +
  // 2. Проверка наличия заказа +
  // 3. Проверка на роль +
  // 4. Проверка что тот кто обращается с запросом является автором +
  // 5. Сравнение что айди в запросе совпадает с айди из списка листперформеров +
  // 6. Проверить что победителя нет и виктори пустой +
  // 7. Очистка списка листперформеров +
  // 8. Заполнение поля селектед перформер тру что победитель выбран +
  // 9. Положить айди победителя в раздел виктори заказа +
  // 10. Статус свободен поменять на выполняется +
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Post("orders/victory")
  async selectVictoryPerformer(
    @User() user: any,
    @Body("victory") victoryOrders: VictoryOrdersDto
  ) {
    console.log(victoryOrders);
    const order = await this.ordersService.selectVictoryPerformerById(
      user,
      victoryOrders
    );
    return this.ordersService.normalizeOrders(order);
  }

  // Установка лайков для заказа одним пользователем
  // 1. Проверка авторизации
  // 2. Получение слага и текущего пользователя
  // 3. Получения текущего заказа по слагу
  // 4. Получение пользователя с отношениями
  @Post("orders/:slug/favorite")
  @UseGuards(AuthGuard)
  async addFavoritesOrder(@User() user: any, @Param("slug") slug: string) {
    const order = await this.ordersService.addFavoritesOrder(user, slug);
    return this.ordersService.normalizeOrders(order);
  }

  // Дизлайк для заказа одним пользователем
  // 1. Проверка авторизации
  // 2. Получение слага и текущего пользователя
  // 3. Получения текущего заказа по слагу
  // 4. Получение пользователя с отношениями
  @Delete("orders/:slug/favorite")
  @UseGuards(AuthGuard)
  async deleteFavoritesOrder(@User() user: any, @Param("slug") slug: string) {
    const order = await this.ordersService.deleteFavoritesOrder(user, slug);
    return this.ordersService.normalizeOrders(order);
  }

  // Получение заказов своих (я клиент) на которые подали заявки мастера
  // 1. Проверка авторизации +
  // 2. Проверка роли +
  // 3. Получение айди текущего пользователя +
  // 4. Поиск заказов своих по своему айди +
  // 5. Проверка на наличие поданных заявок, массив айдишек проверяем
  // 6. Подключаем пагинацию на результаты поиска
  @UseGuards(AuthGuard)
  @Get("orders/submitted/applications")
  async ordersWithSubmittedApplications(@User() user) {
    return this.ordersService.ordersWithSubmittedApplications(user);
  }

  // Получаем заказы для клиента то есть только его заказы вне зависимости подал мастер или нет
  // 1. Проверка авторизации +
  // 2. Проверка роли +
  // 3. Получаем авторов заказов вместе с заказами +
  // 4. Сортировка по дате создания заказов +
  // 5. Фильтрация заказов по авторству чтобы были заказы тольео этого автора +
  // 6. Установка пагинации +
  // 7. Возврат заказов +
  @UseGuards(AuthGuard)
  @Get("orders/my/all/customer")
  async getAllMyOrdersCustomer(@User() user, @Query() query: any) {
    return this.ordersService.getAllMyOrdersCustomer(user, query);
  }

  // Получаем заказы для мастера
  // 1. Проверка авторизации +
  // 2. Проверка роли +
  // 3. Получаем авторов заказов вместе с заказами - необязательно +
  // 4. Сортировка по дате создания заказов +
  // 5. Проверка на пустоту массива с поданными заявками +
  // 6. Поиск в этом массиве моего айди и вернуть только те заказы в которых ес ть мой айди +
  // 7. Пагинация +
  // 8. Возврат на которые я подал заявки +
  @UseGuards(AuthGuard)
  @Get("orders/my/all/performer")
  async getAllMyOrdersPerformer(@User() user, @Query() query: any) {
    return this.ordersService.getAllMyOrdersPerformer(user, query);
  }

  // Создать апи для смены статуса выполнения заказа на выполненно
  // 1. Проверка авторизации +
  // 2. Находим заказ по айди или слагу +
  // 3. Проверка того что мы являемся автором +
  // 4. Проверить что заказ в статусе в работе +
  // 5. Сменить статус в работе на выполненно
  @UseGuards(AuthGuard)
  @Patch("orders/status/done/:slug")
  async setOrderStatusDone(@User() user: any, @Param("slug") slug: string) {
    return this.ordersService.setOrderStatusDone(user, slug);
  }
}
