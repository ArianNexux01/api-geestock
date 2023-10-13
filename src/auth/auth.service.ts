import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt'
import { UsersDao } from 'src/users/users.dao';
@Injectable()
export class AuthService {

    constructor(private usersService: UsersDao, private jwtService: JwtService) { }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        const isPasswordValid = await compare(pass, user.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;
        const payload = { sub: user.id, username: user.name };
        return {
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                company: user.company,
                position: user.position
            },
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
