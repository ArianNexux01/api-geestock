import { Prisma, Pieces } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PieceDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.PiecesCreateInput): Promise<any> {

        return this.prisma.pieces.create({ data });
    }

    async list(): Promise<Pieces[]> {
        const pieces = await this.prisma.pieces.findMany();

        return pieces;
    }

    async find(id: string): Promise<Pieces | null> {
        return this.prisma.pieces.findFirst({ where: { id } });
    }

    async update(id: string, data: Pieces): Promise<Pieces> {
        const user = this.prisma.pieces.update({ where: { id }, data });
        return user
    }

    async delete(id: string): Promise<Pieces> {
        return this.prisma.pieces.delete({ where: { id } });
    }

    async increaseQuantity(id: string, quantity: number): Promise<Pieces> {
        const pieceFound = await this.find(id)
        console.log("PIECE FOUND", pieceFound)
        const piece = this.prisma.pieces.update({
            where: { id },
            data: {
                quantity: pieceFound.quantity + quantity
            }
        });
        console.log(piece)
        return piece
    }
}
