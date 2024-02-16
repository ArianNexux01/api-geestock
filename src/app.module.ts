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
import { RequestModule } from './requests/request.module';
import { LogsActivitiesModule } from './logs-activities/logs-activities.module';
import { AlertsModule } from './alerts/alerts.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EmailService } from './email/email.service';

@Module({

  imports: [UsersModule, AuthModule, RequestModule, WarehouseModule, PieceModule, CategoryModule, SubcategoryModule, TransportModule, OrderModule, SupplierModule, LogsActivitiesModule, AlertsModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
