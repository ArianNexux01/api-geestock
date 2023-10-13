import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
  imports: [UsersModule, AuthModule, WarehouseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
