import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoryService {

  getCategory(): string[] {
    return [
      'Сборка и ремонт мебели',
      'Отделочные работы',
      'Электрика',
      'Сантехника',
      'Ремонт офиса',
      'Остекление балконов',
      'Ремонт ванной',
      'Строительство бань, саун',
      'Ремонт кухни',
      'Строительство домов, коттеджей',
      'Ремонт квартиры'
    ]
  }
}
