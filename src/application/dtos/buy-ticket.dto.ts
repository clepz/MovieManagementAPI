import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class BuyTicketDto {
    @ApiProperty({ format: 'uuid' })
    @IsUUID()
    sessionId: string;

    // the property will be added via an interceptor
    @IsUUID()
    userId: string;
}
