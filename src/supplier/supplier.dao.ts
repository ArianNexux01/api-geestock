import { Prisma, Suppliers } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SupplierDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.SuppliersCreateInput): Promise<any> {

        return this.prisma.suppliers.create({ data });
    }

    async list(searchParam: string, onlyActive: number): Promise<Suppliers[]> {

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
            }
        }

        if (onlyActive == 1) {
            where = {
                AND: [{

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
                    isActive: onlyActive == 1,
                }
                ]
            }
        }
        if ((searchParam !== "" && searchParam !== undefined) || onlyActive !== undefined) {
            const supplier = await this.prisma.suppliers.findMany({
                where,
                orderBy: {
                    name: 'asc'
                }
            });
            return supplier;
        }
        const supplier = await this.prisma.suppliers.findMany({
            orderBy: {
                name: 'asc'
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

    async changeStatus(id: string, status: number): Promise<any> {
        return await this.prisma.suppliers.update({
            where: { id: id },
            data: {
                isActive: status == 1

            }
        })
    }

    async findByName(name: string): Promise<Suppliers> {
        return this.prisma.suppliers.findFirst({ where: { name: name } })
    }
}
