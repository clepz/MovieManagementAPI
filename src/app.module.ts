import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import appConfiguration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm-config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './guards/throttler-behind-proxy.guard';

@Module({
    imports: [
        UsersModule,
        AuthModule,
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
