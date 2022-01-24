import { Module } from "@nestjs/common";
import { OrdersController } from "@app/orders/orders.controller";
import { OrdersService } from "@app/orders/orders.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersEntity } from "@app/orders/orders.entity";
import { UserEntity } from "@app/user/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity, UserEntity])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
