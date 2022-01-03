import { Injectable } from "@nestjs/common";
import { CategoryEntity } from "@app/category/category.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {
  }

  async getCategory(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }
}
