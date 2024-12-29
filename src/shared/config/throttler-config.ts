import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';

const throttlerConfig: ThrottlerAsyncOptions = {
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => {
        return {
            throttlers: [
                {
                    name: 'default',
                    limit: config.get('NODE_ENV') === 'test' ? 1000 : 10,
                    ttl: 1000,
                },
            ],
        };
    },
    inject: [ConfigService],
};

export default throttlerConfig;
