import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierDao } from './supplier.dao';
import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
@Injectable()
export class SupplierService {
  constructor(private subcategoriesDao: SupplierDao) { }
  async create(createSupplierDto: CreateSupplierDto) {
    await this.subcategoriesDao.create(createSupplierDto);
  }

  async findAll() {
    const subcategories = await this.subcategoriesDao.list();
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
    await this.subcategoriesDao.find(id);
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    await this.subcategoriesDao.update(id, updateSupplierDto);
  }

  async remove(id: string) {
    await this.subcategoriesDao.delete(id);
  }
}
