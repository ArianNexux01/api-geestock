import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { RequestDao } from './request.dao';
import { PieceModule } from 'src/pieces/piece.module';
import { InvoiceReciepmentDao } from './invoice.dao';
import { AlertsModule } from 'src/alerts/alerts.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [PrismaModule, PieceModule, AlertsModule],
  controllers: [RequestController],
  providers: [RequestService, RequestDao, InvoiceReciepmentDao, EmailService],
  exports: [RequestDao]
})
export class RequestModule { }
