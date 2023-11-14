import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { PieceModule } from './pieces/piece.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { TransportModule } from './transport/transport.module';
import { OrderModule } from './orders/order.module';
import { SupplierModule } from './supplier/supplier.module';
@Module({
  imports: [UsersModule, AuthModule, WarehouseModule, PieceModule, CategoryModule, SubcategoryModule, TransportModule, OrderModule, SupplierModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
