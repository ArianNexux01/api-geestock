import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { UsersDao } from 'src/users/users.dao';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from '../database/prisma.module';
import { RolesDao } from 'src/users/roles.dao';
@Module({
  imports: [
    UsersModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useFactory: (repo: UsersDao, jwt: JwtService, roleDao: RolesDao) => {
        return new AuthService(repo, jwt, roleDao);
      },
      inject: [UsersDao, JwtService],
    },
    {
      provide: UsersDao,
      useClass: UsersDao,
    },
  ],
})
export class AuthModule {}
