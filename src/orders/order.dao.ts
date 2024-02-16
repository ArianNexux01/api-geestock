import { Prisma, Orders } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class OrderDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any): Promise<any> {
        const ordersPieceData = data.request.map(e => ({
            pieceId: e.pieceId,
            quantity: e.quantity,
            price: e.price
        }))

        return this.prisma.orders.create({
            data: {
                description: data.description,
                number_order: data.number_order,
                imbl_awb: data.imbl_awb,
                reference: data.reference,
                state: data.state,
                OrdersPiece: {
                    createMany: {
                        data: ordersPieceData
                    }
                }
            }
        });
    }

    async list(): Promise<any[]> {
        const orders = await this.prisma.orders.findMany({
            include: {
                OrdersPiece: {
                    select: {
                        orderId: true,
                        pieceId: true,
                        quantity: true,
                        piece: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return orders;
    }

    async find(id: string): Promise<any | null> {
        return this.prisma.orders.findFirst({
            where: { id }, include: {
                OrdersPiece: {
                    select: {
                        pieceId: true,
                        price: true,
                        quantity: true,
                        piece: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
    }

    async update(id: string, data: any): Promise<Orders> {
        const ordersPieceData = data.request.map(e => ({
            pieceId: e.pieceId,
            quantity: e.quantity,
            price: e.price
        }))

        return this.prisma.orders.update({
            where: {
                id
            },
            data: {
                description: data.description,
                number_order: data.number_order,
                imbl_awb: data.imbl_awb,
                reference: data.reference,
            }
        });
    }

    async delete(id: string): Promise<Orders> {
        return this.prisma.orders.delete({ where: { id } });
    }

    async changeStateAndPrice(orderId: string, price: number, state: string, pieceId?: string): Promise<any> {
        const user = await this.prisma.ordersPiece.update({
            where: {
                pieceId_orderId: {
                    orderId: orderId,
                    pieceId: pieceId
                }
            },
            data: {
                price: price,
                Order: {
                    update: {
                        state
                    }
                }
            }
        });

        this.prisma.pieces.update({
            where: {
                id: pieceId
            },
            data: {
                price: price
            }
        })
        return user

    }

    async count(): Promise<any> {
        return this.prisma.orders.count();
    }
}
