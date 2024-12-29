import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.set('trust proxy', 'loopback'); // Trust requests from the loopback address
    app.enableCors();
    app.use(helmet());
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector), {
            strategy: 'excludeAll',
        }),
    );
    const config = new DocumentBuilder()
        .setTitle('Movie Management API')
        .setDescription('The movie management API documentation')
        .setVersion('1.0')
        .addBearerAuth({
            description: 'Please enter access token.',
            name: 'Authorization',
            bearerFormat: 'Bearer',
            scheme: 'Bearer',
            type: 'http',
            in: 'Header',
        })
        .addBearerAuth(
            {
                description: 'Please enter refresh token.',
                name: 'Authorization',
                bearerFormat: 'Bearer',
                scheme: 'Bearer',
                type: 'http',
                in: 'Header',
            },
            'refresh-token',
        )
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
