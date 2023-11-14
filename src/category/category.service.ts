import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryDao } from './category.dao';
import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
@Injectable()
export class CategoryService {
  constructor(private categoriesDao: CategoryDao) { }
  async create(createCategoryDto: CreateCategoryDto) {
    await this.categoriesDao.create(createCategoryDto);
  }

  async findAll() {
    const categories = await this.categoriesDao.list();
    const categoriesToReturn = categories.map(e => ({
      id: e.id,
      name: e.name,
      code: e.code,
      created_at: e.created_at,
      updated_at: e.updated_at
    }))
    return categoriesToReturn;
  }

  async findOne(id: string) {
    await this.categoriesDao.find(id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoriesDao.update(id, updateCategoryDto);
  }

  async remove(id: string) {
    await this.categoriesDao.delete(id);
  }
}
