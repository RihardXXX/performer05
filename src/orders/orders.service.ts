import { Injectable } from "@nestjs/common";

@Injectable()
export class OrdersService {

  async createOrder() {
    return 'create new order'
  }
}
