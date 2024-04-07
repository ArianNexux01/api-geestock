import { Prisma, Pieces } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LogsActivitiesDao } from 'src/logs-activities/logs-activities.dao';

@Injectable()
export class PieceDao {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: any): Promise<any> {

        return this.prisma.pieces.create({ data });

    }

    async list(searchParam?: string, onlyActive?: number): Promise<any> {
        let pieces: any;
        let where: any;
        let select = {
            brand_name: true,
            id: true,
            description: true,
            locationInWarehouse: true,
            partNumber: true,
            name: true,
            price: true,
            state: true,
            target: true,
            min: true,
            isActive: true,
            quantity: true,
            warehouse: {
                select: {
                    name: true
                }
            }
        }

        if (searchParam !== "" && searchParam !== undefined) {
            where = {
                OR: [
                    {
                        partNumber: {
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

                        warehouse: {
                            isActive: true
                        },

                        OR: [
                            {
                                partNumber: {
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
                        isActive: true
                    }
                ]
            };
        }

        if ((searchParam !== "" && searchParam !== undefined) || onlyActive !== undefined) {
            pieces = await this.prisma.pieces.findMany({
                orderBy: {
                    created_at: 'desc'
                },
                where,
                select
            });

            return pieces;
        }
        pieces = await this.prisma.pieces.findMany({
            orderBy: {
                created_at: 'desc'
            },
            select
        });


        return pieces;
    }

    async find(id: string): Promise<Pieces | null> {
        return this.prisma.pieces.findFirst({
            where: { id },
            include: {
                category: true,
                subcategory: true,
                supplier: true,
                warehouse: true
            },
        });
    }

    async update(id: string, data: Pieces): Promise<Pieces> {
        const piece = this.prisma.pieces.update({ where: { id }, data });
        return piece
    }

    async delete(id: string): Promise<Pieces> {
        return this.prisma.pieces.delete({ where: { id } });
    }

    async increaseQuantity(id: string, quantity: number, locationInWarehouse: string): Promise<Pieces> {
        const pieceFound = await this.find(id)
        const piece = this.prisma.pieces.update({
            where: { id },
            data: {
                quantity: pieceFound.quantity + quantity,
                locationInWarehouse: locationInWarehouse
            }
        });

        return piece
    }

    async updateQuantity(id: string, quantity: number): Promise<Pieces> {
        const piece = this.prisma.pieces.update({
            where: { id },
            data: {
                quantity: quantity
            },
            include: {
                category: true,
                subcategory: true,
                supplier: true,
                warehouse: true
            },
        });
        return piece
    }

    async updatePrice(id: string, newPrice: number): Promise<Pieces> {
        const piece = this.prisma.pieces.update({
            where: { id }, data: {
                price: newPrice
            }
        });
        return piece
    }

    async updateWarehouse(id: string, warehouse: string): Promise<any> {
        const piece = await this.prisma.pieces.update({
            where: { id },
            data: {
                warehouseId: warehouse
            }
        });
        return piece
    }

    async findByWarehouseId(warehouseId: string, searchParam: string): Promise<any> {
        if (searchParam !== "" && searchParam !== undefined) {
            const piecesByWarehouse = await this.prisma.pieces.findMany({
                where: {
                    AND: [
                        { warehouseId },
                        {
                            warehouse: {
                                isActive: true
                            }
                        },
                        {
                            OR: [
                                {
                                    partNumber: {
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
                        { isActive: true },
                    ]
                },
                orderBy: {
                    created_at: 'desc'
                }
            })
            return piecesByWarehouse
        }
        const piecesByWarehouse = await this.prisma.pieces.findMany({
            where: {
                AND: [
                    { warehouseId },
                    {
                        isActive: true
                    }
                ]

            },
            orderBy: {
                created_at: 'desc'
            }
        })
        return piecesByWarehouse
    }

    async findByPartNumberAndWarehouse(warehouseId: string, partNumber: string) {
        const piecesByWarehousePartNumber = await this.prisma.pieces.findFirst({
            where: {
                warehouseId,
                partNumber,

            }
        })
        return piecesByWarehousePartNumber
    }

    async count(warehouseId: string): Promise<any> {
        if (warehouseId !== undefined) {
            return (await this.prisma.pieces.aggregate({
                _sum: {
                    quantity: true
                },
                where: {
                    AND: [{
                        warehouseId: warehouseId,
                        warehouse: {
                            type: 'Armazém',
                            isActive: true
                        }
                    }]
                }
            }))._sum.quantity;
        }
        return (await this.prisma.pieces.aggregate({
            _sum: {
                quantity: true
            },
            where: {
                warehouse: {
                    type: 'Armazém',
                    isActive: true
                }
            }
        }))._sum.quantity;


    }

    async changeStatus(id: string, status: number): Promise<any> {
        const returnData = await this.prisma.pieces.update({
            where: { id: id },
            data: {
                isActive: status == 1
            }
        })

        return returnData
    }
}
