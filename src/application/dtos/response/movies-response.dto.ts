import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class MovieSessionResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty({ type: 'string', format: 'date' })
    @Expose()
    date: Date;

    @ApiProperty()
    @Expose()
    time: string;

    @ApiProperty()
    @Expose()
    roomNumber: number;
}

export class MovieResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    title: string;

    @ApiProperty()
    @Expose()
    description: string;

    @ApiProperty()
    @Expose()
    ageRestriction: number;

    @Type(() => MovieSessionResponseDto)
    @ApiProperty({ type: MovieSessionResponseDto, isArray: true })
    @Expose()
    sessions: MovieSessionResponseDto[];
}
