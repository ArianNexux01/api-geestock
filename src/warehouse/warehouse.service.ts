import { Injectable } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseDao } from './warehouse.dao';
import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
@Injectable()
export class WarehouseService {
  constructor(private warehousesDao: WarehouseDao) {}
  async create(createWarehouseDto: CreateWarehouseDto) {
    await this.warehousesDao.create(createWarehouseDto);
  }

  async findAll() {
    const warehouses = await this.warehousesDao.list();
    const warehousesToReturn = warehouses.map(e => ({
      id: e.id,
      name: e.name,
      description: e.description,
      country: e.country,
      province: e.province,
      address: e.address,
      code: e.code,
      created_at: e.created_at,
      updated_at: e.updated_at
    }))
    return warehousesToReturn;
  }

  async findOne(id: string) {
    await this.warehousesDao.find(id);
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
    await this.warehousesDao.update(id, updateWarehouseDto);
  }

  async remove(id: string) {
    await this.warehousesDao.delete(id);
  }
}
