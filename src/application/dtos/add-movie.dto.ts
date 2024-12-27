import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsEnum,
    IsInt,
    IsISO8601,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    ValidateNested,
} from 'class-validator';
import TIME_SLOT from '../../shared/enums/time-slots.enum';

class MovieSessionDto {
    @ApiProperty({ example: '2021-12-31' })
    @IsString()
    @IsNotEmpty()
    @IsISO8601()
    date: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEnum(TIME_SLOT)
    time: TIME_SLOT;

    @ApiProperty({ description: 'Room number must be an existing roomId' })
    @IsInt()
    @IsPositive()
    roomNumber: number;
}

export class AddMovieDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Age restriction must be a positive number' })
    @IsInt()
    @IsPositive()
    ageRestriction: number;

    @ApiProperty({ isArray: true, type: MovieSessionDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MovieSessionDto)
    sessions: MovieSessionDto[];
}