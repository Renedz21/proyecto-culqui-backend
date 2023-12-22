import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    async create(createUserDto: CreateUserDto) {
        try {

            const { password, ...data } = createUserDto;

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const newUser = this.userRepository.create({
                ...data,
                password: hash
            });

            await this.userRepository.save(newUser);
            delete newUser.password;

            return {
                ...newUser,
                token: this.getJwtToken({ id: newUser.id }),
            }

        } catch (error) {
            console.log(error);
        }
    }

    async login(loginUserDto: LoginUserDto) {
        try {

            const { password, email } = loginUserDto;

            const user = await this.userRepository.findOne({
                where: {
                    email
                },
                select: { id: true, email: true, name: true, password: true, roles: true }
            });

            if (!user) {
                throw new UnauthorizedException('Usuario no encontrado')
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                throw new UnauthorizedException('Contraseña incorrecta')
            }

            delete user.password;

            return {
                user: {
                    ...user
                },
                token: this.getJwtToken({ id: user.id }),
            }

        } catch (error) {
            console.log(error);
        }
    }

    private getJwtToken(payload: JwtPayload) {
        const token = this.jwtService.sign(payload);
        return token;
    }
}
