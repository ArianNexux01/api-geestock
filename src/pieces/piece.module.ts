import { Module } from '@nestjs/common';
import { PieceService } from './piece.service';
import { PieceController } from './piece.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { PieceDao } from './piece.dao';
import { LogsActivitiesModule } from 'src/logs-activities/logs-activities.module';
import { ExcellService } from 'src/services/excell/excell.service';
import { SupplierDao } from 'src/supplier/supplier.dao';
import { SubcategoryDao } from 'src/subcategory/subcategory.dao';
import { CategoryDao } from 'src/category/category.dao';
import { WarehouseDao } from 'src/warehouse/warehouse.dao';

@Module({
  imports: [PrismaModule, LogsActivitiesModule],
  controllers: [PieceController],
  providers: [PieceService, PieceDao, ExcellService, SupplierDao, SubcategoryDao, CategoryDao, WarehouseDao],
  exports: [PieceDao, PieceService]
})
export class PieceModule { }
