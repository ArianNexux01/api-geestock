import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersDao } from './users.dao';
import { PrismaModule } from '../database/prisma.module';
import { RolesDao } from './roles.dao';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersDao, RolesDao],
})
export class UsersModule {}
