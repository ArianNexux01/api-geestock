import { Prisma, Warehouse } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WarehouseDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.WarehouseCreateInput): Promise<any> {

        return this.prisma.warehouse.create({ data });
    }

    async list(): Promise<Warehouse[]> {
        const warehouse = await this.prisma.warehouse.findMany();

        return warehouse;
    }

    async find(id: string): Promise<Warehouse | null> {
        return this.prisma.warehouse.findFirst({ where: { id } });
    }

    async update(id: string, data: Warehouse): Promise<Warehouse> {
        const user = this.prisma.warehouse.update({ where: { id }, data });
        return user
    }

    async delete(id: string): Promise<Warehouse> {
        return this.prisma.warehouse.delete({ where: { id } });
    }
}
