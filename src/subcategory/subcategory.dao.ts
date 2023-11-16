import { Prisma, SubCategories } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { ListSubcategoryDto } from './dto/list-subcategory.dto';

@Injectable()
export class SubcategoryDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateSubcategoryDto): Promise<any> {

        return this.prisma.subCategories.create({ 
            data:{
            name: data.name,
            code: data.code,
            category: {
               connect:{id: data.categoryId}
            }
        },     
    });

    }

    async list(): Promise<ListSubcategoryDto[]> {
        const subcategory = await this.prisma.subCategories.findMany({
            include: {
            category: true
        }});
        
        return subcategory
    }

    async find(id: string): Promise<SubCategories | null> {
        return this.prisma.subCategories.findFirst({ where: { id }, include: {
            category: true
        } });
    }

    async update(id: string, data: SubCategories): Promise<SubCategories> {
        const user = this.prisma.subCategories.update({ where: { id }, data });
        return user
    }

    async delete(id: string): Promise<SubCategories> {
        return this.prisma.subCategories.delete({ where: { id } });
    }
}
