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
import TimeSlot from '../../shared/enums/time-slots.enum';

export class ModifyMovieSessionDto {
    @ApiProperty({ example: '2021-12-31', type: 'string', format: 'date' })
    @IsString()
    @IsNotEmpty()
    @IsISO8601()
    @IsOptional()
    date: string;

    @ApiProperty({ enum: TimeSlot })
    @IsString()
    @IsNotEmpty()
    @IsEnum(TimeSlot)
    @IsOptional()
    time: TimeSlot;

    @ApiProperty({ description: 'Room number must be an existing roomId' })
    @IsInt()
    @IsPositive()
    @IsOptional()
    roomNumber: number;
}
