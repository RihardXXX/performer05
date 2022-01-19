import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";

// тут мы будем проверять имеется пользователь после
// https://docs.nestjs.com/guards
@Injectable()
export default class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const isUser = request.headers.authorization;
    // Если в мидлваре мы положили распарсенные данные
    // Допуск к роуту
    if (isUser) {
      return true;
    }

    throw new HttpException(
      "только для авторизованных пользователей",
      HttpStatus.UNAUTHORIZED
    );
  }
}
