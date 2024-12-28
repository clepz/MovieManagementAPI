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
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import { AddMovieDto } from '../../../application/dtos/add-movie.dto';
import AddMovieUseCase from '../../../application/use-cases/add-movie.use-case';
import { GetCurrentUserId } from '../decorators/get-current-user-id.decorator';
import { CheckRole } from '../decorators/check-role.decorator';
import Role from '../../../shared/enums/role.enum';
import DeleteMovieUseCase from '../../../application/use-cases/delete-movie.use-case';
import MovieService from '../../../domain/services/movie.service';
import { plainToInstance } from 'class-transformer';
import { MovieResponseDto } from '../../../application/dtos/response/movies-response.dto';
import { ModifyMovieDto } from '../../../application/dtos/modify-movie.dto';
import { BulkOperationResponseDto } from '../../../application/dtos/response/bulk-operation-response.dto';
import AddMovieBulkUseCase from '../../../application/use-cases/add-movie-bulk.use-case';
import {
    AddMovieBulkSwagger,
    AddMovieSwagger,
    DeleteMovieSwagger,
    GetAllMoviesSwagger,
    GetMovieSwagger,
    UpdateMovieSwagger,
} from '../../../shared/swagger/movie.swagger';

@Controller('movies')
export class MoviesController {
    constructor(
        private readonly addMovieUseCase: AddMovieUseCase,
        private readonly deleteMovieUseCase: DeleteMovieUseCase,
        private readonly movieService: MovieService,
        private readonly addMovieBulkUseCase: AddMovieBulkUseCase,
    ) {}

    @ApiBearerAuth()
    @ApiOperation(AddMovieSwagger.POST.operation)
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 201, description: 'Movie created' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({
        status: 409,
        description: 'There is another movie session that conflicts',
    })
    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @CheckRole([Role.MANAGER])
    async addMovie(
        @Body() movie: AddMovieDto,
        @GetCurrentUserId() userId: string,
    ) {
        await this.addMovieUseCase.execute(movie, userId);
    }

    @ApiBearerAuth()
    @ApiBody({ type: AddMovieDto, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({
        status: 201,
        description: 'Movies added in bulk',
        type: BulkOperationResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiOperation(AddMovieBulkSwagger.POST.operation)
    @Post('bulk')
    @HttpCode(HttpStatus.CREATED)
    @CheckRole([Role.MANAGER])
    async addMovieBulk(
        @Body() movies: AddMovieDto[],
        @GetCurrentUserId() userId: string,
    ) {
        const result = await this.addMovieBulkUseCase.execute(movies, userId);
        return plainToInstance(BulkOperationResponseDto, result);
    }

    @ApiBearerAuth()
    @ApiOperation(DeleteMovieSwagger.DELETE.operation)
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 204, description: 'Movie deleted' })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    @ApiParam({ name: 'id', schema: { format: 'uuid' } })
    @Delete('/:id')
    @CheckRole([Role.MANAGER])
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteMovie(
        @Param('id', ParseUUIDPipe) id: string,
        @GetCurrentUserId() userId: string,
    ): Promise<void> {
        await this.deleteMovieUseCase.execute(id, userId);
    }

    @ApiBearerAuth()
    @ApiOperation(GetAllMoviesSwagger.GET.operation)
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({
        status: 200,
        description: 'List of movies',
        type: MovieResponseDto,
        isArray: true,
    })
    @Get('')
    async getAllMovies() {
        const movies = await this.movieService.getMovies();
        return movies.map((movie) => plainToInstance(MovieResponseDto, movie));
    }

    @ApiBearerAuth()
    @ApiOperation(GetMovieSwagger.GET.operation)
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({
        status: 200,
        description: 'Movie details',
        type: MovieResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Movie not found' })
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
    @ApiOperation(UpdateMovieSwagger.PATCH.operation)
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 204, description: 'Movie modified' })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    @Patch('/:id')
    @CheckRole([Role.MANAGER])
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateMovie(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() modifiedMovie: ModifyMovieDto,
        @GetCurrentUserId() userId: string,
    ) {
        return await this.movieService.modifyMovie(id, modifiedMovie, userId);
    }
}
