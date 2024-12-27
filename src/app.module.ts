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

@Module({
    imports: [
        UsersModule,
        AuthModule,
        MoviesModule,
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
    ],
    // controllers: [AppController],
    providers: [{ provide: 'APP_GUARD', useClass: ThrottlerBehindProxyGuard }],
})
export class AppModule {}
