import TIME_SLOT from '../../shared/enums/time-slots.enum';

export class MovieSessionVO {
    constructor(
        private readonly date: string,
        private readonly time: TIME_SLOT,
        private readonly roomNumber: number,
    ) {}

    equals(other: MovieSessionVO): boolean {
        return (
            this.date === other.date &&
            this.time === other.time &&
            this.roomNumber === other.roomNumber
        );
    }

    toString(): string {
        return `${this.date}-${this.time}-${this.roomNumber}`;
    }
}
