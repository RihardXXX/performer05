import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "@app/config";
import { UserService } from "@app/user/user.service";

// https://docs.nestjs.com/middleware
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {
  }

  async use(request: Request, response: Response, next: NextFunction) {
    if (!request.headers.authorization) {
      // если нет токена
      request.headers.authorization = null;
      next();
      return;
    }

    // токен от клиента парсим и получаем данные пользователя
    const token = request.headers.authorization.split(' ')[1];
    try {
      const decoded = verify(token, JWT_SECRET);
      const id = decoded.id;
      const user = await this.userService.getUserById(id);
      // просто в хедар кладём готового пользователя
      request.headers.authorization = user;
      next();
    } catch(err) {
      // Если токен распарсить не получилось или он фальшивый
      // Мы просто чистим заголовки для экшенов
      request.headers.authorization = null;
      console.log(err);
      next();
    }
  }
}
