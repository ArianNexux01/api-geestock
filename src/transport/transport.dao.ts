import { Prisma, Transports } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TransportDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.TransportsCreateInput): Promise<any> {

        return this.prisma.transports.create({ data });
    }

    async list(): Promise<Transports[]> {
        const transports = await this.prisma.transports.findMany();

        return transports;
    }

    async find(id: string): Promise<Transports | null> {
        return this.prisma.transports.findFirst({ where: { id } });
    }

    async update(id: string, data: Transports): Promise<Transports> {
        const user = this.prisma.transports.update({ where: { id }, data });
        return user
    }

    async delete(id: string): Promise<Transports> {
        return this.prisma.transports.delete({ where: { id } });
    }
}
