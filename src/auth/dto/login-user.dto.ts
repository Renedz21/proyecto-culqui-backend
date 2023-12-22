import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class LoginUserDto {
    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}