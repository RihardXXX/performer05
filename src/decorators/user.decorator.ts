import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// запрос - мидлваре - гуардс - декоратор кастомный - экшен

// этот декоратор просто из заголовков забирает данные юзера после
// обработки его в мидлваре
// https://docs.nestjs.com/custom-decorators
const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers.authorization;
})

export {
  User
}
