import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { CheckRole } from '../decorators/check-role.decorator';
import Role from '../../../shared/enums/role.enum';
import { GetCurrentUserId } from '../decorators/get-current-user-id.decorator';
import {
    ApiBearerAuth,
    ApiConflictResponse,
    ApiParam,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { MovieSessionDto } from '../../../application/dtos/add-movie.dto';
import MovieSessionService from '../../../domain/services/movie-session.service';
import { ModifyMovieSessionDto } from '../../../application/dtos/modify-movie-session.dto';
import {
    AddMovieSessionSwagger,
    DeleteMovieSessionSwagger,
    UpdateMovieSessionSwagger,
} from '../../../shared/swagger/movie-session.swagger';

@ApiParam({ name: 'movieId', schema: { format: 'uuid' } })
@Controller('movies/:movieId/sessions')
export class MovieSessionController {
    constructor(private readonly movieSessionService: MovieSessionService) {}

    @ApiBearerAuth()
    @ApiOperation(AddMovieSessionSwagger.POST.operation)
    @ApiResponse({ status: 201, description: 'Movie Session created' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({
        status: 409,
        description: 'There is another movie session that conflicts',
    })
    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @CheckRole([Role.MANAGER])
    async addSession(
        @Param('movieId', ParseUUIDPipe) movieId: string,
        @Body() movieSession: MovieSessionDto,
        @GetCurrentUserId() userId: string,
    ) {
        await this.movieSessionService.addSession(
            movieId,
            movieSession,
            userId,
        );
    }
    @ApiBearerAuth()
    @ApiOperation(DeleteMovieSessionSwagger.DELETE.operation)
    @ApiResponse({ status: 204, description: 'Movie Session deleted' })
    @ApiResponse({ status: 404, description: 'Movie Session not found' })
    @ApiParam({ name: 'id', schema: { format: 'uuid' } })
    @Delete('/:id')
    @CheckRole([Role.MANAGER])
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteSession(
        @Param('movieId', ParseUUIDPipe) movieId: string,
        @Param('id', ParseUUIDPipe) id: string,
        @GetCurrentUserId() userId: string,
    ): Promise<void> {
        const ret = await this.movieSessionService.removeSession(
            id,
            movieId,
            userId,
        );
        if (!ret) {
            throw new NotFoundException('Movie Session not found');
        }
    }
    @ApiBearerAuth()
    @ApiParam({ name: 'id', schema: { format: 'uuid' } })
    @ApiOperation(UpdateMovieSessionSwagger.PATCH.operation)
    @ApiResponse({ status: 204, description: 'Movie Session modified' })
    @ApiResponse({ status: 404, description: 'Movie Session not found' })
    @Patch('/:id')
    @CheckRole([Role.MANAGER])
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateMovie(
        @Param('movieId', ParseUUIDPipe) movieId: string,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() modifiedMovieSession: ModifyMovieSessionDto,
        @GetCurrentUserId() userId: string,
    ) {
        return await this.movieSessionService.modifySession(
            id,
            movieId,
            modifiedMovieSession,
            userId,
        );
    }
}
