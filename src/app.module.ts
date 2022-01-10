import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { CategoryModule } from "@app/category/category.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '@app/ormconfig';
import { UserModule } from "@app/user/user.module";
import { AuthMiddleware } from "@app/middlewares/auth.middleware";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    CategoryModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

// https://docs.nestjs.com/middleware
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL
      });
  }
}
