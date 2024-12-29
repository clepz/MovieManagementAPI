import { join } from 'path';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import typeormConfig from '../src/infrastructure/database/typeorm-config';
import fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfiguration from '../src/shared/config/configuration';

dotenvConfig({ path: join(__dirname, '../.env.test') });

module.exports = async () => {
    // Create a Nest application context to initialize the ConfigService
    const app = await NestFactory.createApplicationContext(
        ConfigModule.forRoot({
            load: [appConfiguration],
            isGlobal: true,
        }),
        {
            logger: false,
        },
    );
    const configService = app.get(ConfigService);

    // Create a DataSource instance using the typeormConfig
    const dataSourceOptions = await typeormConfig.useFactory(configService);
    const dataSource = new DataSource(dataSourceOptions as DataSourceOptions);
    await dataSource.initialize();

    // Synchronize the database schema, dropping all data first
    await dataSource.synchronize(true);

    // Read the SQL file
    const sql = fs.readFileSync(
        join(__dirname, '../after_tables_created.sql'),
        'utf8',
    );

    // Run the SQL queries
    await dataSource.query(sql);

    await dataSource.destroy();
    await app.close();
};
