import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { CategoryModule } from "@app/category/category.module";

@Module({
  imports: [CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
