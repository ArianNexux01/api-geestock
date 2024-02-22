import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { RequestDao } from './request.dao';
import { PieceModule } from 'src/pieces/piece.module';
import { AlertsModule } from 'src/alerts/alerts.module';
import { EmailService } from 'src/email/email.service';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Module({
  imports: [PrismaModule, PieceModule, AlertsModule, InvoiceModule],
  controllers: [RequestController],
  providers: [RequestService, RequestDao, EmailService],
  exports: [RequestDao]
})
export class RequestModule { }
