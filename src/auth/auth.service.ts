import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersDao } from 'src/users/users.dao';
import { jwtConstants } from './constants';
import { RolesDao } from 'src/users/roles.dao';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersDao,
    private jwtService: JwtService,
    private rolesDao: RolesDao,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user.position === '3') {
      let atLeastOneWarehouseActive = user.warehouse.filter(
        (e: any) => e.Warehouse?.isActive,
      );
      if (
        atLeastOneWarehouseActive.length === 0 ||
        user.warehouse.length === 0
      ) {
        throw new UnauthorizedException();
      }
    }
    const isPasswordValid = await compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    const warehouse = user.warehouse
      .map((e) => e.Warehouse)
      .filter((warehouse) => warehouse !== null);
    const payload = { sub: user.id, username: user.name };
    const roles = await this.usersService.findRoleyId(user.position);
    return {
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        position: user.position,
        role: roles.name,
        warehouse: warehouse,
      },
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async decodeToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
