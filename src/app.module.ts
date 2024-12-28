import { Module } from '@nestjs/common';
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
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    name: 'default',
                    limit: 10,
                    ttl: 1000,
                },
            ],
        }),
        LoggerModule,
    ],
    // controllers: [AppController],
    providers: [
        { provide: APP_GUARD, useClass: ThrottlerBehindProxyGuard },
        {
            provide: APP_FILTER,
            useClass: GeneralExceptionFilter,
        },
    ],
})
export class AppModule {}
