import { Controller, Get } from "@nestjs/common";
import { CategoryService } from "@app/category/category.service";

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategory(): Promise<{category: string[]}> {
    const categories = await this.categoryService.getCategory();
    return {
      category: categories.map(category => category.name),
    }
  }
}
