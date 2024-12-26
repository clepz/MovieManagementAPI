import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/models/user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply()
            .exclude(
                {
                    path: '/register',
                    method: RequestMethod.POST,
                },
                {
                    path: '/login',
                    method: RequestMethod.POST,
                },
            )
            .forRoutes(UsersController);
    }
}
