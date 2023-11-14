import { Prisma, Orders } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class OrderDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.OrdersCreateInput): Promise<any> {

        return this.prisma.orders.create({ data });
    }

    async list(): Promise<Orders[]> {
        const orders = await this.prisma.orders.findMany();

        return orders;
    }

    async find(id: string): Promise<Orders | null> {
        return this.prisma.orders.findFirst({ where: { id } });
    }

    async update(id: string, data: Orders): Promise<Orders> {
        const user = this.prisma.orders.update({ where: { id }, data });
        return user
    }

    async delete(id: string): Promise<Orders> {
        return this.prisma.orders.delete({ where: { id } });
    }
}
