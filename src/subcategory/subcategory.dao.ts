import { Prisma, SubCategories } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { ListSubcategoryDto } from './dto/list-subcategory.dto';

@Injectable()
export class SubcategoryDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any): Promise<any> {

        return this.prisma.subCategories.create({
            data: {
                name: data.name,
                code: data.code,
                category: {
                    connect: { id: data.categoryId }
                }
            },
        });

    }

    async list(searchParam: string, onlyActive: number): Promise<ListSubcategoryDto[]> {
        let where = {}
        if (searchParam !== "" && searchParam !== undefined) {
            where = {
                OR: [
                    {
                        code: {
                            contains: searchParam,
                        },
                    },
                    {
                        name: {
                            contains: searchParam,
                        },
                    },
                ]
            };
        }

        if (onlyActive == 1) {
            where = {
                AND: [
                    {
                        OR: [
                            {
                                code: {
                                    contains: searchParam,
                                },
                            },
                            {
                                name: {
                                    contains: searchParam,
                                },
                            },
                        ]
                    },
                    {
                        isActive: true,
                    }
                ]
            };
        }

        if ((searchParam !== "" && searchParam !== undefined) || onlyActive !== undefined) {
            const subcategory = await this.prisma.subCategories.findMany({
                where,
                include: {
                    category: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            return subcategory
        }
        const subcategory = await this.prisma.subCategories.findMany({
            include: {
                category: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return subcategory
    }

    async find(id: string): Promise<SubCategories | null> {
        return this.prisma.subCategories.findFirst({
            where: { id }, include: {
                category: true
            }
        });
    }

    async findByCategory(id: string): Promise<ListSubcategoryDto[]> {
        const subcategory = this.prisma.subCategories.findMany({
            where: {
                categoryId: id
            }, include: {
                category: true
            }
        });

        return subcategory
    }


    async update(id: string, data: any): Promise<SubCategories> {
        console.log(data)
        const subcategory = await this.prisma.subCategories.update({
            where: { id },
            data: {
                name: data.name,
                code: data.code,
                category: {
                    connect: { id: data.categoryId }
                }
            },
        });
        return subcategory
    }

    async delete(id: string): Promise<SubCategories> {
        return this.prisma.subCategories.delete({ where: { id } });
    }

    async changeStatus(id: string, status: number): Promise<any> {
        return await this.prisma.subCategories.update({
            where: { id: id },
            data: {
                isActive: status == 1

            }
        })
    }
}
