import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsLowercase,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
    Min,
    MinLength,
} from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({ description: 'Username must be at least 4 characters' })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    username: string;

    @ApiProperty()
    @IsStrongPassword()
    password: string;

    @ApiProperty({ description: 'Age must be at least 5' })
    @IsNotEmpty()
    @IsInt()
    @Min(5)
    age: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;
}
