import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import EntityStatus from '../../shared/enums/entity-status.enum';
import { Type } from 'class-transformer';

export enum TicketStatusDto {
    ACTIVE = EntityStatus.ACTIVE,
    INACTIVE = EntityStatus.INACTIVE,
}

export class StatusQueryDto {
    @ApiPropertyOptional({ enum: TicketStatusDto })
    @Type(() => Number)
    @IsEnum(TicketStatusDto)
    @IsOptional()
    status?: EntityStatus;
}
