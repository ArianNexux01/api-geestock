import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { WarehouseDao } from './warehouse.dao';

@Module({
  imports: [PrismaModule],
  controllers: [WarehouseController],
  providers: [WarehouseService, WarehouseDao],
})
export class WarehouseModule {}
