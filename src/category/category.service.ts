import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryDao } from './category.dao';

import { LogsActivitiesDao } from 'src/logs-activities/logs-activities.dao';
@Injectable()
export class CategoryService {
  constructor(
    private categoriesDao: CategoryDao,
    private logsActivitiesDao: LogsActivitiesDao) { }
  async create(createCategoryDto: CreateCategoryDto) {
    await this.logsActivitiesDao.create({
      userId: createCategoryDto.userId,
      description: `Criou a categoria ${createCategoryDto.name} com o codigo ${createCategoryDto.code}`
    })
    delete createCategoryDto.userId
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
    return await this.categoriesDao.find(id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.logsActivitiesDao.create({
      userId: updateCategoryDto.userId,
      description: `Actualizou a categoria ${updateCategoryDto.name} com o codigo ${updateCategoryDto.code}`
    })
    await this.categoriesDao.update(id, updateCategoryDto);
  }

  async remove(id: string) {
    await this.categoriesDao.delete(id);
  }
}
