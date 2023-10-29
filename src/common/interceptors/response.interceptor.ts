import {
  CallHandler,
  Injectable,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const success_message = this.reflector.get<string[]>(
          'success_message',
          context.getHandler(),
        );
        return {
          success: true,
          message: success_message ?? 'called successfully',
          data: data,
        };
      }),
    );
  }
}
