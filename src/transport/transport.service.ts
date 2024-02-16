import { Injectable } from '@nestjs/common';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { TransportDao } from './transport.dao';

import { LogsActivitiesDao } from 'src/logs-activities/logs-activities.dao';
@Injectable()
export class TransportService {
  constructor(private transportsDao: TransportDao, private logsActivitiesDao: LogsActivitiesDao) { }
  async create(createTransportDto: CreateTransportDto) {
    await this.logsActivitiesDao.create({
      userId: createTransportDto.userId,
      description: `Criou o Transporte ${createTransportDto.name} com o codigo ${createTransportDto.code}`
    })

    delete createTransportDto.userId
    await this.transportsDao.create(createTransportDto);
  }

  async findAll() {
    const transports = await this.transportsDao.list();
    const transportsToReturn = transports.map(e => ({
      id: e.id,
      name: e.name,
      code: e.code,
      created_at: e.created_at,
      updated_at: e.updated_at
    }))
    return transportsToReturn;
  }

  async findOne(id: string) {
    return await this.transportsDao.find(id);
  }

  async update(id: string, updateTransportDto: UpdateTransportDto) {
    await this.logsActivitiesDao.create({
      userId: updateTransportDto.userId,
      description: `Actualizou o Transporte ${updateTransportDto.name} com o codigo ${updateTransportDto.code}`
    })
    return await this.transportsDao.update(id, updateTransportDto);
  }

  async remove(id: string) {
    await this.transportsDao.delete(id);
  }
}
