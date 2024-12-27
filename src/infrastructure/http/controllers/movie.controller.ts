import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
} from '@nestjs/swagger';
import { AddMovieDto } from '../../../application/dtos/add-movie.dto';
import AddMovieUseCase from '../../../application/use-cases/add-movie.use-case';
import { GetCurrentUserId } from '../decorators/get-current-user-id.decorator';
import { CheckRole } from '../decorators/check-role.decorator';
import ROLE from '../../../shared/enums/role.enum';
import DeleteMovieUseCase from '../../../application/use-cases/delete-movie.use-case';

@Controller('movies')
export class MoviesController {
    constructor(
        private readonly addMovieUseCase: AddMovieUseCase,
        private readonly deleteMovieUseCase: DeleteMovieUseCase,
    ) {}
    @ApiBearerAuth()
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiConflictResponse({
        description: 'There is another movie session that conflicts',
    })
    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @CheckRole([ROLE.manager])
    async createMovie(
        @Body() movie: AddMovieDto,
        @GetCurrentUserId() userId: string,
    ) {
        return await this.addMovieUseCase.execute(movie, userId);
    }

    @ApiBearerAuth()
    @Delete(':id')
    @CheckRole([ROLE.manager])
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteMovie(@Param('id') id: string): Promise<void> {
        await this.deleteMovieUseCase.execute(id);
    }
}
