import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import winstonConfig from '../../../shared/config/logger-config';
import { LoggerService } from '../../../shared/services/custom-logger.service';

@Global()
@Module({
    imports: [WinstonModule.forRootAsync(winstonConfig)],
    providers: [
        {
            provide: LoggerService,
            useClass: LoggerService,
        },
    ],
    exports: [LoggerService],
})
export class LoggerModule {}
