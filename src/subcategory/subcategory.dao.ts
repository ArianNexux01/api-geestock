import { Prisma, SubCategories } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SubcategoryDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.SubCategoriesCreateInput): Promise<any> {

        return this.prisma.subCategories.create({ data });
    }

    async list(): Promise<SubCategories[]> {
        const warehouse = await this.prisma.subCategories.findMany();

        return warehouse;
    }

    async find(id: string): Promise<SubCategories | null> {
        return this.prisma.subCategories.findFirst({ where: { id } });
    }

    async update(id: string, data: SubCategories): Promise<SubCategories> {
        const user = this.prisma.subCategories.update({ where: { id }, data });
        return user
    }

    async delete(id: string): Promise<SubCategories> {
        return this.prisma.subCategories.delete({ where: { id } });
    }
}
