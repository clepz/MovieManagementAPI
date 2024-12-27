import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class IndivialOperationResponseDto {
    @ApiProperty()
    @Expose()
    success: boolean;

    @ApiProperty({ required: false })
    @Expose()
    message: string;
}

export class BulkOperationResponseDto {
    @ApiProperty({ type: IndivialOperationResponseDto, isArray: true })
    @Type(() => IndivialOperationResponseDto)
    @Expose()
    results: IndivialOperationResponseDto[];
}
