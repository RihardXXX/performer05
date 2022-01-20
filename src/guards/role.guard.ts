import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

// Этот гуард нужен для проверки роли
export default class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.headers.authorization;

    // проверка на роль
    if (user.role === "customer") {
      return true;
    }

    throw new HttpException(
      "пользователь только с ролью клиент может совершать это действие",
      HttpStatus.UNAUTHORIZED
    );
  }
}
