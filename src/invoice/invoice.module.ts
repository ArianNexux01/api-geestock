import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { InvoiceReciepmentDao } from './invoice.dao';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceReciepmentDao],
  exports: [InvoiceReciepmentDao]
})
export class InvoiceModule { }
