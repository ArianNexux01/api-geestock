import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { SubcategoryDao } from './subcategory.dao';

@Module({
  imports: [PrismaModule],
  controllers: [SubcategoryController],
  providers: [SubcategoryService, SubcategoryDao],
})
export class SubcategoryModule { }
