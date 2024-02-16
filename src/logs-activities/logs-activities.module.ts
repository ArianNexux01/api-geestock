import { Global, Module } from '@nestjs/common';
import { LogsActivitiesService } from './logs-activities.service';
import { LogsActivitiesController } from './logs-activities.controller';
import { LogsActivitiesDao } from './logs-activities.dao';
import { PrismaModule } from 'src/database/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [LogsActivitiesController],
  providers: [LogsActivitiesService, LogsActivitiesDao],
  exports: [LogsActivitiesDao],
})
export class LogsActivitiesModule { }
