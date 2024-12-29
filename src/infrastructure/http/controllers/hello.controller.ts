import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../decorators/is-public.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class HelloController {
    @Public()
    @ApiOperation({
        summary: 'Get Hello World',
        description:
            'Returns a Hello World message. Rate limited to 1 request per 5 seconds.',
    })
    @ApiResponse({ status: 200, description: 'Hello World' })
    @Get('hello')
    @Throttle({ default: { limit: 1, ttl: 5000 } })
    getHello(): string {
        return 'Hello World!';
    }
}
