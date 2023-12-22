import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {

    @IsString()
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    name: string;

    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}