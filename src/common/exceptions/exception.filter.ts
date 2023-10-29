import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(
      typeof (exception as HttpException).getResponse(),
      (exception as HttpException).getResponse(),
    );

    const responseBody = {
      statusCode: httpStatus,
      message:
        exception instanceof HttpException
          ? typeof (exception.getResponse() as any).message === 'string'
            ? (exception.getResponse() as any).message
            : (exception.getResponse() as any).message[0] || 'Error ocurred!!'
          : 'Error ocurred!!',
      success: false,
      stack: exception instanceof HttpException ? exception.stack : '',
      error: exception,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
