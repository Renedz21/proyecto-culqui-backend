import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/auth.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });

    }

    async validate(payload: JwtPayload): Promise<User> {

        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id })

        if (!user) {
            throw new UnauthorizedException('User not found.');
        }

        return user;
    }

}