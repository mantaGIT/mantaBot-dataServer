import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger/custom-logger.service';

@Injectable()
export class AppService {
  private readonly loggerContext = 'AppService';

  constructor(private readonly logger: CustomLoggerService) {}

  check(): string {
    this.logger.log('logger test', this.loggerContext);
    return 'Manta-bot data server';
  }
}
