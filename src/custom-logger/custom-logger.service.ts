import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  log(message: string, context?: string) {
    super.log(message, context ? context : '');
    // this.discordEmit();
  }

  error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context ? context : '');
    // this.discordEmit();
  }

  private discordEmit() {}
}
