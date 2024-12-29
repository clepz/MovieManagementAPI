import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class IndividualOperationResponseDto {
    @ApiProperty()
    @Expose()
    success: boolean;

    @ApiProperty({
        required: false,
        description: 'Error message if operation failed',
    })
    @Expose()
    message: string;
}

export class BulkOperationResponseDto {
    @ApiProperty({ type: IndividualOperationResponseDto, isArray: true })
    @Type(() => IndividualOperationResponseDto)
    @Expose()
    results: IndividualOperationResponseDto[];
}
