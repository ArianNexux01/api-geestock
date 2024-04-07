import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs'
import { UsersDao } from 'src/users/users.dao';
@Injectable()
export class AuthService {

    constructor(private usersService: UsersDao, private jwtService: JwtService) { }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        console.log(user)
        if (user.position !== "1") {

            let atLeastOneWarehouseActive = user.warehouse.filter((e: any) => e.Warehouse?.isActive)
            if (atLeastOneWarehouseActive.length === 0 || user.warehouse.length === 0) {
                throw new UnauthorizedException();
            }
        }
        const isPasswordValid = await compare(pass, user.password)
        console.log(isPasswordValid)

        if (!isPasswordValid) {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;
        const warehouse = user.warehouse.map(e => e.Warehouse).filter(warehouse => warehouse !== null);
        const payload = { sub: user.id, username: user.name };

        return {
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                company: user.company,
                position: user.position,
                warehouse: warehouse
            },
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
