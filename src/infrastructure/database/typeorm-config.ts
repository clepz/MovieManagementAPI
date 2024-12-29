import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

const typeormConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) =>
        ({
            type: 'postgres',
            host: configService.get('database.host'),
            port: configService.get('database.port'),
            username: configService.get('database.user'),
            password: configService.get('database.password'),
            database: configService.get('database.database'),
            synchronize: configService.get('database.sync'),
            entities: [__dirname + '/../../domain/entities/*.entity{.ts,.js}'],
            logging: false,
        }) as DataSourceOptions,
    inject: [ConfigService],
};

export default typeormConfig;
