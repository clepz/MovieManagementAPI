import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.set('trust proxy', 'loopback'); // Trust requests from the loopback address
    app.enableCors();
    app.use(helmet());
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    const config = new DocumentBuilder()
        .setTitle('Movie Management API')
        .setDescription('The movie management API documentation')
        .setVersion('1.0')
        .addTag('movies')
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
