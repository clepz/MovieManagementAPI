import { HttpException, Injectable } from '@nestjs/common';
import { AddMovieDto } from '../dtos/add-movie.dto';
import {
    BulkOperationResponseDto,
    IndivialOperationResponseDto,
} from '../dtos/response/bulk-operation.dto';
import AddMovieUseCase from './add-movie.use-case';

@Injectable()
export default class AddMovieBulkUseCase {
    constructor(private readonly addMovieUseCase: AddMovieUseCase) {}

    async execute(
        movies: AddMovieDto[],
        userId: string,
    ): Promise<BulkOperationResponseDto> {
        const promiseResults = await Promise.allSettled(
            movies.map((movie) => this.addMovieUseCase.execute(movie, userId)),
        );
        const results = promiseResults.map((result) => {
            let errMsg: string | undefined = undefined;
            if (result.status === 'rejected') {
                errMsg =
                    result.reason instanceof HttpException
                        ? (result.reason.getResponse() as string)
                        : 'Internal server error';
            }
            return {
                success: result.status === 'fulfilled',
                message: errMsg,
            } as IndivialOperationResponseDto;
        });
        return { results };
    }
}
