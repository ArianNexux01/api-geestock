import { Prisma, Alerts } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AlertsDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any): Promise<any> {

        return this.prisma.alerts.create({ data });
    }

    async list(): Promise<Alerts[]> {
        const alerts = await this.prisma.alerts.findMany();

        return alerts;
    }

    async find(id: string): Promise<Alerts | null> {
        return this.prisma.alerts.findFirst({
            where: { id },
            include: {
                warehouse: true
            }
        });
    }

    async update(id: string, data: any): Promise<Alerts> {
        const alerts = this.prisma.alerts.update({ where: { id }, data });
        return alerts
    }

    async delete(id: string): Promise<Alerts> {
        return this.prisma.alerts.delete({ where: { id } });
    }

}
