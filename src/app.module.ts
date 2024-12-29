import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './infrastructure/http/modules/users.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import appConfiguration from './shared/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './infrastructure/database/typeorm-config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './infrastructure/http/guards/throttler-behind-proxy.guard';
import { MoviesModule } from './infrastructure/http/modules/movies.module';
import { TicketsModule } from './infrastructure/http/modules/tickets.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import GeneralExceptionFilter from './infrastructure/http/exception-filters/all-exceptions.filter';
import { LoggerModule } from './infrastructure/http/modules/logger.module';
import { HelloController } from './infrastructure/http/controllers/hello.controller';
import { CorrelationIdMiddleware } from './shared/middlewares/correlation-id.middleware';
import { HelloService } from './hello/hello.service';
import throttlerConfig from './shared/config/throttler-config';

@Module({
    imports: [
        UsersModule,
        AuthModule,
        MoviesModule,
        TicketsModule,
        ConfigModule.forRoot({
            load: [appConfiguration],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(typeormConfig),
        ThrottlerModule.forRootAsync(throttlerConfig),
        LoggerModule,
    ],
    controllers: [HelloController],
    providers: [
        { provide: APP_GUARD, useClass: ThrottlerBehindProxyGuard },
        {
            provide: APP_FILTER,
            useClass: GeneralExceptionFilter,
        },
        HelloService,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CorrelationIdMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
