import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { PieceModule } from 'src/pieces/piece.module';
import { RequestModule } from 'src/requests/request.module';
import { OrderModule } from 'src/orders/order.module';

@Module({
  imports: [RequestModule, WarehouseModule, PieceModule, OrderModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
