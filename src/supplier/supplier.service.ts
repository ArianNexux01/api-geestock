import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierDao } from './supplier.dao';

import { LogsActivitiesDao } from 'src/logs-activities/logs-activities.dao';
@Injectable()
export class SupplierService {
  constructor(private supplierDao: SupplierDao, private logsActivitiesDao: LogsActivitiesDao) { }
  async create(createSupplierDto: CreateSupplierDto) {
    await this.logsActivitiesDao.create({
      userId: createSupplierDto.userId,
      description: `Criou o fornecedor ${createSupplierDto.name} com o codigo ${createSupplierDto.code}`
    })

    delete createSupplierDto.userId

    await this.supplierDao.create(createSupplierDto);
  }

  async findAll(searchParam: string, onlyActive: number) {
    const subcategories = await this.supplierDao.list(searchParam, onlyActive);
    const subcategoriesToReturn = subcategories.map(e => ({
      id: e.id,
      name: e.name,
      isActive: e.isActive,
      code: e.code,
      created_at: e.created_at,
      updated_at: e.updated_at
    }))
    return subcategoriesToReturn;
  }

  async findOne(id: string) {
    return await this.supplierDao.find(id);
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {

    await this.logsActivitiesDao.create({
      userId: updateSupplierDto.userId,
      description: `Actualizou o fornecedor ${updateSupplierDto.name} com o codigo ${updateSupplierDto.code}`
    })
    delete updateSupplierDto.userId
    await this.supplierDao.update(id, updateSupplierDto);
  }

  async remove(id: string) {
    await this.supplierDao.delete(id);
  }

  async changeStatus(id: string, status: number) {
    await this.supplierDao.changeStatus(id, status);
  }
}
