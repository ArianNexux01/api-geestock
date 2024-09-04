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
import { InvoiceModule } from './invoice/invoice.module';
import { ExcellService } from './services/excell/excell.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtStrategy } from './auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt.auth.guard';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    RequestModule,
    WarehouseModule,
    PieceModule,
    CategoryModule,
    SubcategoryModule,
    TransportModule,
    OrderModule,
    SupplierModule,
    LogsActivitiesModule,
    AlertsModule,
    DashboardModule,
    InvoiceModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ExcellService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
