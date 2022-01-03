import { Module } from "@nestjs/common";
import { CategoryController } from "@app/category/category.controller";
import { CategoryService } from "./category.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "@app/category/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {

}
