import { Module, RequestMethod, MiddlewareConsumer } from "@nestjs/common";
import { AppController } from "@app/app.controller";
import { AppService } from "@app/app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormconfig from "@app/ormconfig";
import { UserModule } from "@app/user/user.module";
import { AuthMiddleware } from "@app/middlewares/auth.middleware";
import { OrdersModule } from "@app/orders/orders.module";
import { ReviewsModule } from "@app/reviews/reviews.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ChatGateway } from "./chats/chat.gateway";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    UserModule,
    OrdersModule,
    ReviewsModule,
    ChatGateway,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client"),
      exclude: ["/api*"],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

// https://docs.nestjs.com/middleware
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    });
  }
}
