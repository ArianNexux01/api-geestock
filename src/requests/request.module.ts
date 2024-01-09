import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { RequestDao } from './request.dao';
import { PieceModule } from 'src/pieces/piece.module';
import { InvoiceReciepmentDao } from './invoice.dao';

@Module({
  imports: [PrismaModule, PieceModule],
  controllers: [RequestController],
  providers: [RequestService, RequestDao, InvoiceReciepmentDao],

})
export class RequestModule { }
