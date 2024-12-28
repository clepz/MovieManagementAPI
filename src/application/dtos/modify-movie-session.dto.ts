import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsISO8601,
    IsEnum,
    IsInt,
    IsPositive,
    IsOptional,
} from 'class-validator';
import TIME_SLOT from '../../shared/enums/time-slots.enum';

export class ModifyMovieSessionDto {
    @ApiProperty({ example: '2021-12-31', type: 'string', format: 'date' })
    @IsString()
    @IsNotEmpty()
    @IsISO8601()
    @IsOptional()
    date: string;

    @ApiProperty({ enum: TIME_SLOT })
    @IsString()
    @IsNotEmpty()
    @IsEnum(TIME_SLOT)
    @IsOptional()
    time: TIME_SLOT;

    @ApiProperty({ description: 'Room number must be an existing roomId' })
    @IsInt()
    @IsPositive()
    @IsOptional()
    roomNumber: number;
}
