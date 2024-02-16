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

    async list(): Promise<Pieces[]> {
        const pieces = await this.prisma.pieces.findMany({
            orderBy: {
                created_at: 'desc'
            }
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
            }
        });
    }

    async update(id: string, data: Pieces): Promise<Pieces> {
        const piece = this.prisma.pieces.update({ where: { id }, data });
        return piece
    }

    async delete(id: string): Promise<Pieces> {
        return this.prisma.pieces.delete({ where: { id } });
    }

    async increaseQuantity(id: string, quantity: number): Promise<Pieces> {
        const pieceFound = await this.find(id)
        const piece = this.prisma.pieces.update({
            where: { id },
            data: {
                quantity: pieceFound.quantity + quantity
            }
        });

        return piece
    }

    async updateQuantity(id: string, quantity: number): Promise<Pieces> {
        const piece = this.prisma.pieces.update({
            where: { id },
            data: {
                quantity: quantity
            }
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

    async findByWarehouseId(warehouseId: string): Promise<any> {
        const piecesByWarehouse = await this.prisma.pieces.findMany({
            where: { warehouseId },
            orderBy: {
                created_at: 'desc'
            }
        })
        console.log(piecesByWarehouse)
        return piecesByWarehouse
    }

    async findByPartNumberAndWarehouse(warehouseId: string, partNumber: string) {
        const piecesByWarehousePartNumber = await this.prisma.pieces.findFirst({
            where: {
                warehouseId,
                partNumber
            }
        })
        return piecesByWarehousePartNumber
    }

    async count(): Promise<any> {
        return this.prisma.pieces.count();
    }
}
