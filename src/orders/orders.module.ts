import { Module } from "@nestjs/common";
import { OrdersController } from "@app/orders/orders.controller";
import { OrdersService } from "@app/orders/orders.service";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {

}
