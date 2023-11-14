import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { OrderDao } from './order.dao';
import { PieceDao } from 'src/pieces/piece.dao';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [OrderService, OrderDao, PieceDao],
})
export class OrderModule { }
