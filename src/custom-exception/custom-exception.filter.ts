import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

@Catch()
export class CustomExceptionFilter<T> implements ExceptionFilter {
  private readonly CONTEXT = 'ExceptionFilter';

  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const stackTrace = exception instanceof Error ? exception.stack : null;

    // 서버 내부 에러 발생 - log level: error
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `HTTP Status: ${status} / ${exception}`,
        stackTrace,
        this.CONTEXT,
      );
    }
    // 나머지 예외 상황 - log level: warn
    else {
      this.logger.warn(`HTTP Status: ${status} - ${exception}`, this.CONTEXT);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception instanceof Error
          ? exception.message
          : 'Internal Server Error',
    });
  }
}
