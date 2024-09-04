import { Prisma, Warehouse } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WarehouseDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.WarehouseCreateInput): Promise<any> {
        return this.prisma.warehouse.create({ data });
    }

    async list(searchParam: string, onlyActive: number): Promise<Warehouse[]> {
        let where = {}
        if (searchParam !== "" && searchParam !== undefined) {
            where = {
                AND: [{

                    OR: [
                        {
                            name: {
                                contains: searchParam,
                            }
                        },
                        {
                            code: {
                                contains: searchParam
                            }
                        }
                    ]
                }
                ]
            };
        }

        if (onlyActive == 1) {
            where = {
                AND: [{

                    OR: [
                        {
                            name: {
                                contains: searchParam,
                            }
                        },
                        {
                            code: {
                                contains: searchParam
                            }
                        }
                    ]
                },
                {
                    isActive: onlyActive == 1
                }
                ]
            };
        }

        if ((searchParam !== "" && searchParam !== undefined) || onlyActive !== undefined) {
            const warehouse = await this.prisma.warehouse.findMany({
                where,
                orderBy: {
                    name: 'desc'
                }
            });
            return warehouse;
        }
        const warehouse = await this.prisma.warehouse.findMany({
            orderBy: {
                name: 'desc'
            }
        });
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

    async count(): Promise<any> {
        return this.prisma.warehouse.count();
    }

    async changeStatus(id: string, status: number): Promise<any> {
        return await this.prisma.warehouse.update({
            where: { id: id },
            data: {
                isActive: status == 1

            }
        })
    }
}
