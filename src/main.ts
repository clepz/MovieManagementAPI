import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.use(helmet());
    const config = new DocumentBuilder()
        .setTitle('Movie Management API')
        .setDescription('The movie management API documentation')
        .setVersion('1.0')
        .addTag('movies')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
