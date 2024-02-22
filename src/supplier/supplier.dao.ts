import { Prisma, Suppliers } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SupplierDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.SuppliersCreateInput): Promise<any> {

        return this.prisma.suppliers.create({ data });
    }

    async list(searchParam: string): Promise<Suppliers[]> {
        if (searchParam !== "" && searchParam !== undefined) {
            const supplier = await this.prisma.suppliers.findMany({
                where: {
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
                orderBy: {
                    created_at: 'desc'
                }
            });
            return supplier;

        }
        const supplier = await this.prisma.suppliers.findMany({
            orderBy: {
                created_at: 'desc'
            }
        });

        return supplier;
    }

    async find(id: string): Promise<Suppliers | null> {
        return this.prisma.suppliers.findFirst({ where: { id } });
    }

    async update(id: string, data: Suppliers): Promise<Suppliers> {
        const user = this.prisma.suppliers.update({ where: { id }, data });
        return user
    }

    async delete(id: string): Promise<Suppliers> {
        return this.prisma.suppliers.delete({ where: { id } });
    }
}
