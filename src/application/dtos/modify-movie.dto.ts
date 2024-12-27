import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsInt,
    IsPositive,
} from 'class-validator';

export class ModifyMovieDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        required: false,
        description: 'Age restriction must be a positive number',
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    ageRestriction: number;
}
