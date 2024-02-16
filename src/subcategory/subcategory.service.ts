import { Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoryDao } from './subcategory.dao';
import { LogsActivitiesDao } from 'src/logs-activities/logs-activities.dao';
@Injectable()
export class SubcategoryService {
  constructor(
    private subcategoriesDao: SubcategoryDao,
    private logsActivitiesDao: LogsActivitiesDao
  ) { }
  async create(createSubcategoryDto: CreateSubcategoryDto) {
    await this.subcategoriesDao.create({
      categoryId: createSubcategoryDto.categoryId,
      name: createSubcategoryDto.name,
      code: createSubcategoryDto.code
    });
    await this.logsActivitiesDao.create({
      userId: createSubcategoryDto.userId,
      description: `Criou a subcategoria ${createSubcategoryDto.name} com o codigo ${createSubcategoryDto.code}`
    })
  }

  async findAll() {
    const subcategories = await this.subcategoriesDao.list();
    const subcategoriesToReturn = subcategories.map(e => ({
      id: e.id,
      name: e.name,
      code: e.code,
      category: e.category,
      created_at: e.created_at,
      updated_at: e.updated_at
    }))
    return subcategoriesToReturn;
  }

  async findByCategory(category: string) {
    const subcategories = await this.subcategoriesDao.findByCategory(category);
    const subcategoriesToReturn = subcategories.map(e => ({
      id: e.id,
      name: e.name,
      code: e.code,
      category: e.category,
      created_at: e.created_at,
      updated_at: e.updated_at
    }))
    return subcategoriesToReturn;
  }

  async findOne(id: string) {
    return await this.subcategoriesDao.find(id);
  }


  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    await this.logsActivitiesDao.create({
      userId: updateSubcategoryDto.userId,
      description: `Actualizou a subcategoria ${updateSubcategoryDto.name} com o codigo ${updateSubcategoryDto.code}`
    })
    await this.subcategoriesDao.update(id, updateSubcategoryDto);
  }

  async remove(id: string) {
    await this.subcategoriesDao.delete(id);
  }
}
