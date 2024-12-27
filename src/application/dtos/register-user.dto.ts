import { ApiProperty } from '@nestjs/swagger';
import {
    IsLowercase,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsStrongPassword,
    Min,
} from 'class-validator';

export class RegisterUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsLowercase()
    username: string;

    @ApiProperty()
    @IsStrongPassword()
    password: string;

    @ApiProperty({ description: 'Age must be at least 5' })
    @IsNotEmpty()
    @IsNumber()
    @Min(5)
    age: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;
}
