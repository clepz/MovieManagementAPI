import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsInt,
    IsISO8601,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    ValidateNested,
} from 'class-validator';
import TimeSlot from '../../shared/enums/time-slots.enum';

export class MovieSessionDto {
    @ApiProperty({ example: '2021-12-31', type: 'string', format: 'date' })
    @IsString()
    @IsNotEmpty()
    @IsISO8601()
    date: string;

    @ApiProperty({ enum: TimeSlot })
    @IsString()
    @IsNotEmpty()
    @IsEnum(TimeSlot)
    time: TimeSlot;

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
