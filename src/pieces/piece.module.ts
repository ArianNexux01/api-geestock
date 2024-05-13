import { Module } from '@nestjs/common';
import { PieceService } from './piece.service';
import { PieceController } from './piece.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { PieceDao } from './piece.dao';
import { LogsActivitiesModule } from 'src/logs-activities/logs-activities.module';

@Module({
  imports: [PrismaModule, LogsActivitiesModule],
  controllers: [PieceController],
  providers: [PieceService, PieceDao],
  exports: [PieceDao, PieceService]
})
export class PieceModule { }
