import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './interface/auth.interface';

@Injectable()
export class AuthService {
    constructor (
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(payload: RegisterUserDto) :Promise<UserToken> {
        const user = await this.userService.getUser({'email': payload.email});
        if (user) {
            throw new ConflictException('Email already in use');
        }
        const newUser = await this.userService.createUser(payload);
        return this.generateUserToken(newUser);
    }

    async login(payload:LoginUserDto) :Promise<UserToken> {
        const user = await this.userService.getUser({'email': payload.email})
        if (!user) {
            throw new NotFoundException("User not found");
        }
        
        // we shall use the phoneNumber as the password
        // as the figma design U.I doesnt provide a field
        // for password
        if (user?.phoneNumber != payload.phoneNumber) {
            throw new UnauthorizedException("Invalid Credentials");
        }
        
        return await this.generateUserToken(user);
    }

    async generateUserToken(user: User) :Promise<UserToken> {
        const payload = {
            id: user.id,
            email: user.email,
            phoneNumber: user.phoneNumber,
            name: user.name
        }
        return {
            access_token: await this.jwtService.signAsync(payload),
            ...payload
        }
    }
}
