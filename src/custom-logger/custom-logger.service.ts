import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  log(message: string, context?: string): void {
    super.log(message, context ? context : '');
    // this.discordEmit();
  }

  error(message: string, trace?: string, context?: string): void {
    super.error(message, undefined, context ? context : '');
    // log에는 trace는 남기지 않기 - discord webhook으로 전달
    // this.discordEmit();
  }

  verbose(message: string, context?: string): void {
    super.verbose(message, context ? context : '');
    // this.discordEmit();
  }

  warn(message: string, context?: string): void {
    super.warn(message, context ? context : '');
  }

  private discordEmit() {}
}
