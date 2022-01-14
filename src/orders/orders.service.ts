import { Injectable } from "@nestjs/common";

@Injectable()
export class OrdersService {

  async createOrder(createOrder) {
    return createOrder;
  }
}
