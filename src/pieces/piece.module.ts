import { Module } from '@nestjs/common';
import { PieceService } from './piece.service';
import { PieceController } from './piece.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { PieceDao } from './piece.dao';

@Module({
  imports: [PrismaModule],
  controllers: [PieceController],
  providers: [PieceService, PieceDao],
  exports: [PieceDao]
})
export class PieceModule { }
