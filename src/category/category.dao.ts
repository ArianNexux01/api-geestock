import { Prisma, Categories } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CategoryDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.CategoriesCreateInput): Promise<any> {

        return this.prisma.categories.create({ data });
    }

    async list(searchParam: string): Promise<Categories[]> {
        if (searchParam !== undefined && searchParam !== '') {
            const categories = await this.prisma.categories.findMany({
                where: {
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
}
