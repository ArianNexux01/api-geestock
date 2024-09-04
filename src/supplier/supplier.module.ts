import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { SupplierDao } from './supplier.dao';

@Module({
  imports: [PrismaModule],
  controllers: [SupplierController],
  providers: [SupplierService, SupplierDao],
  exports: [SupplierDao]
})
export class SupplierModule { }
