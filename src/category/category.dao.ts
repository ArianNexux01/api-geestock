import { Prisma, Categories } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CategoryDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.CategoriesCreateInput): Promise<any> {

        return this.prisma.categories.create({ data });
    }

    async list(searchParam: string, onlyActive: number): Promise<Categories[]> {

        let where;

        if (searchParam !== undefined && searchParam !== '') {
            where = {
                OR: [
                    {
                        code: {
                            contains: searchParam,
                        }
                    },
                    {
                        name: {
                            contains: searchParam,
                        }
                    }
                ]

            };
        }
        if (onlyActive == 1) {
            where = {
                AND: [{
                    OR: [
                        {
                            code: {
                                contains: searchParam,
                            }
                        },
                        {
                            name: {
                                contains: searchParam,
                            }
                        }
                    ]

                },
                {
                    isActive: true
                }]
            };
        }
        if ((searchParam !== "" && searchParam !== undefined) || onlyActive !== undefined) {
            const categories = await this.prisma.categories.findMany({
                where,
                orderBy: {
                    created_at: 'desc'
                }
            });

            return categories;
        }
        const categories = await this.prisma.categories.findMany();

        return categories;
    }

    async find(id: string): Promise<Categories | null> {
        return this.prisma.categories.findFirst({ where: { id } });
    }

    async update(id: string, data: Categories): Promise<Categories> {
        const user = this.prisma.categories.update({ where: { id }, data });
        return user
    }

    async delete(id: string): Promise<Categories> {
        return this.prisma.categories.delete({ where: { id } });
    }

    async changeStatus(id: string, status: number): Promise<any> {
        return await this.prisma.categories.update({
            where: { id: id },
            data: {
                isActive: status == 1
            }
        })
    }
}
