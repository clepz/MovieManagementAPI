import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import appConfiguration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm-config';

@Module({
    imports: [
        UsersModule,
        AuthModule,
        ConfigModule.forRoot({
            load: [appConfiguration],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(typeormConfig),
    ],
    // controllers: [AppController],
    // providers: [AppService],
})
export class AppModule {}
