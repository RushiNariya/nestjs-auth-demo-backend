import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type CurrentUserResponse =
  | string
  | number
  | { id: number; email: string; access_token: string };

export const CurrentUser = createParamDecorator(
  (
    data: string | undefined,
    context: ExecutionContext,
  ): CurrentUserResponse => {
    const request = context.switchToHttp().getRequest();

    if (!data) return request.user;

    return request.user[data];
  },
);
