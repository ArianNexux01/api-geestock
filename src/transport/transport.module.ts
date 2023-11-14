import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { TransportDao } from './transport.dao';

@Module({
  imports: [PrismaModule],
  controllers: [TransportController],
  providers: [TransportService, TransportDao],
})
export class TransportModule { }
