import NotAvailableTimeForMovieSessionException from '../exceptions/not-available-time-for-movie-session.exception';

function movieSessionUniqueViolationMessageExtractAndThrow(error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const timeDetailMessage = error.detail
        .match(/=\((.*?)\) already/)[1]
        .replace(', null', '') as string;
    throw new NotAvailableTimeForMovieSessionException(timeDetailMessage);
}

export default movieSessionUniqueViolationMessageExtractAndThrow;
