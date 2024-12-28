import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
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
}
