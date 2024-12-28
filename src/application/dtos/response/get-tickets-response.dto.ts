import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
    MovieResponseDto,
    MovieSessionResponseDto,
} from './movies-response.dto';
import EntityStatus from '../../../shared/enums/entity-status.enum';

class MovieResponseWithoutSessionsDto extends OmitType(MovieResponseDto, [
    'sessions',
]) {}

class MovieSessionWithMovieDto extends MovieSessionResponseDto {
    @ApiProperty()
    @Expose()
    @Type(() => MovieResponseWithoutSessionsDto)
    movie: MovieResponseWithoutSessionsDto;
}

export class GetTicketsResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @Type(() => MovieSessionWithMovieDto)
    @ApiProperty({ type: MovieSessionWithMovieDto })
    @Expose()
    session: MovieSessionWithMovieDto;

    @ApiProperty({ enum: EntityStatus })
    @Expose()
    status: EntityStatus;
}
