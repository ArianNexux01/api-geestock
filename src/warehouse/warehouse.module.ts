import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { WarehouseDao } from './warehouse.dao';
import { LogsActivitiesModule } from 'src/logs-activities/logs-activities.module';

@Module({
  imports: [PrismaModule],
  controllers: [WarehouseController],
  providers: [WarehouseService, WarehouseDao],
  exports: [WarehouseDao]
})
export class WarehouseModule { }
