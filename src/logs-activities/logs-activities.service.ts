import { Global, Injectable } from '@nestjs/common';
import { CreateLogsActivityDto } from './dto/create-logs-activity.dto';
import { UpdateLogsActivityDto } from './dto/update-logs-activity.dto';
import { LogsActivitiesDao } from './logs-activities.dao';

@Injectable()
export class LogsActivitiesService {
  constructor(
    private logsActivitiesDao: LogsActivitiesDao
  ) {

  }
  create(
    createLogsActivityDto: CreateLogsActivityDto,
  ) {
    this.logsActivitiesDao.create(createLogsActivityDto);
  }

  findAll() {
    return this.logsActivitiesDao.list();
  }

  findOne(id: string) {
    return this.logsActivitiesDao.find(id);
  }

  update(id: string, updateLogsActivityDto: UpdateLogsActivityDto) {
    return this.logsActivitiesDao.update(id, updateLogsActivityDto);;
  }

  remove(id: string) {
    return this.logsActivitiesDao.delete(id);;
  }
}
