import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { AlertsDao } from './alerts.dao';

@Injectable()
export class AlertsService {
  constructor(private alertsDao: AlertsDao) {

  }
  create(createAlertDto: CreateAlertDto) {
    return this.alertsDao.create(createAlertDto);
  }

  findAll() {
    return this.alertsDao.list();
  }

  findOne(id: string) {
    return this.alertsDao.find(id);
  }

  update(id: string, updateAlertDto: UpdateAlertDto) {
    return this.alertsDao.update(id, updateAlertDto);
  }

  remove(id: string) {
    return this.alertsDao.delete(id);
  }
}
