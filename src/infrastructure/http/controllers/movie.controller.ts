import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiConflictResponse,
    ApiNoContentResponse,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import { AddMovieDto } from '../../../application/dtos/add-movie.dto';
import AddMovieUseCase from '../../../application/use-cases/add-movie.use-case';
import { GetCurrentUserId } from '../decorators/get-current-user-id.decorator';
import { CheckRole } from '../decorators/check-role.decorator';
import ROLE from '../../../shared/enums/role.enum';
import DeleteMovieUseCase from '../../../application/use-cases/delete-movie.use-case';
import MovieService from '../../../domain/services/movie.service';
import { plainToInstance } from 'class-transformer';
import { MovieResponseDto } from '../../../application/dtos/response/movies-response.dto';
import { ModifyMovieDto } from '../../../application/dtos/modify-movie.dto';
import { BulkOperationResponseDto } from '../../../application/dtos/response/bulk-operation.dto';
import AddMovieBulkUseCase from '../../../application/use-cases/add-movie-bulk.use-case';

@Controller('movies')
export class MoviesController {
    constructor(
        private readonly addMovieUseCase: AddMovieUseCase,
        private readonly deleteMovieUseCase: DeleteMovieUseCase,
        private readonly movieService: MovieService,
        private readonly addMovieBulkUseCase: AddMovieBulkUseCase,
    ) {}

    @ApiBearerAuth()
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiConflictResponse({
        description: 'There is another movie session that conflicts',
    })
    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @CheckRole([ROLE.manager])
    async addMovie(
        @Body() movie: AddMovieDto,
        @GetCurrentUserId() userId: string,
    ) {
        return await this.addMovieUseCase.execute(movie, userId);
    }

    @ApiBearerAuth()
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiBody({ type: AddMovieDto, isArray: true })
    @ApiResponse({ type: BulkOperationResponseDto })
    @Post('bulk')
    @HttpCode(HttpStatus.CREATED)
    @CheckRole([ROLE.manager])
    async addMovieBulk(
        @Body() movies: AddMovieDto[],
        @GetCurrentUserId() userId: string,
    ) {
        const result = await this.addMovieBulkUseCase.execute(movies, userId);
        return plainToInstance(BulkOperationResponseDto, result);
    }

    @ApiBearerAuth()
    @ApiParam({ name: 'id', schema: { format: 'uuid' } })
    @Delete('/:id')
    @CheckRole([ROLE.manager])
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteMovie(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        await this.deleteMovieUseCase.execute(id);
    }

    @ApiBearerAuth()
    @ApiResponse({ type: MovieResponseDto, isArray: true })
    @Get('')
    async getAllMovies() {
        const movies = await this.movieService.getMovies();
        return movies.map((movie) => plainToInstance(MovieResponseDto, movie));
    }

    @ApiBearerAuth()
    @ApiParam({ name: 'id', schema: { format: 'uuid' } })
    @ApiResponse({ type: MovieResponseDto })
    @Get('/:id')
    async getMovie(@Param('id', ParseUUIDPipe) id: string) {
        const movie = await this.movieService.getMovieById(id, true);
        if (!movie) {
            throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
        }
        return plainToInstance(MovieResponseDto, movie);
    }

    @ApiBearerAuth()
    @ApiParam({ name: 'id', schema: { format: 'uuid' } })
    @ApiNoContentResponse({ description: 'Movie modified' })
    @Patch('/:id')
    @CheckRole([ROLE.manager])
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateMovie(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() modifiedMovie: ModifyMovieDto,
        @GetCurrentUserId() userId: string,
    ) {
        return await this.movieService.modifyMovie(id, modifiedMovie, userId);
    }
}
