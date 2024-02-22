import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierDao } from './supplier.dao';

import { LogsActivitiesDao } from 'src/logs-activities/logs-activities.dao';
@Injectable()
export class SupplierService {
  constructor(private subcategoriesDao: SupplierDao, private logsActivitiesDao: LogsActivitiesDao) { }
  async create(createSupplierDto: CreateSupplierDto) {
    await this.logsActivitiesDao.create({
      userId: createSupplierDto.userId,
      description: `Criou o fornecedor ${createSupplierDto.name} com o codigo ${createSupplierDto.code}`
    })

    delete createSupplierDto.userId

    await this.subcategoriesDao.create(createSupplierDto);
  }

  async findAll(searchParam: string) {
    const subcategories = await this.subcategoriesDao.list(searchParam);
    const subcategoriesToReturn = subcategories.map(e => ({
      id: e.id,
      name: e.name,
      code: e.code,
      created_at: e.created_at,
      updated_at: e.updated_at
    }))
    return subcategoriesToReturn;
  }

  async findOne(id: string) {
    return await this.subcategoriesDao.find(id);
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    await this.subcategoriesDao.update(id, updateSupplierDto);
    await this.logsActivitiesDao.create({
      userId: updateSupplierDto.userId,
      description: `Actualizou o fornecedor ${updateSupplierDto.name} com o codigo ${updateSupplierDto.code}`
    })
  }

  async remove(id: string) {
    await this.subcategoriesDao.delete(id);
  }
}
