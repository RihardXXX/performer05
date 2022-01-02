import { Controller, Get } from "@nestjs/common";
import { CategoryService } from "@app/category/category.service";

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getCategory(): string[] {
    return this.categoryService.getCategory();
  }
}
