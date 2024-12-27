import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokensResponseDto {
    @ApiProperty()
    @Expose()
    access_token: string;

    @ApiProperty()
    @Expose()
    refresh_token: string;
}
