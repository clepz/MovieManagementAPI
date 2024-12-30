import { ApiProperty } from '@nestjs/swagger';
import {
    IsOptional,
    IsString,
    IsEnum,
    IsInt,
    Min,
    IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SortOrder } from '../../shared/enums/querying.enum';

export enum MovieQuerySortField {
    TITLE = 'title',
    AGE = 'ageRestriction',
}

export class GetAllMoviesQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    ageRestriction?: number;

    @ApiProperty({ required: false, minimum: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    minAgeRestriction?: number;

    @ApiProperty({ required: false, minimum: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    maxAgeRestriction?: number;

    @ApiProperty({ required: false, enum: MovieQuerySortField })
    @IsOptional()
    @IsEnum(MovieQuerySortField)
    sortField?: MovieQuerySortField;

    @ApiProperty({ required: false, enum: SortOrder })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder;

    @ApiProperty({
        required: false,
        type: Boolean,
        description:
            'If false, will return all movies, regardless of availability. Only managers can see unavailable movies',
    })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value?.toLowerCase() === 'true')
    isAvailable?: boolean;
}
