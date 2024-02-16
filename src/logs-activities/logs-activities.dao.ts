import { Prisma, LogsActivities } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LogsActivitiesDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any): Promise<any> {

        return this.prisma.logsActivities.create({ data });
    }

    async list(): Promise<LogsActivities[]> {
        const logsActivities = await this.prisma.logsActivities.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return logsActivities;
    }

    async find(id: string): Promise<LogsActivities | null> {
        return this.prisma.logsActivities.findFirst({
            where: { id },
            include: {
                user: true
            }
        });
    }

    async update(id: string, data: any): Promise<LogsActivities> {
        const logsActivities = this.prisma.logsActivities.update({ where: { id }, data });
        return logsActivities
    }

    async delete(id: string): Promise<LogsActivities> {
        return this.prisma.logsActivities.delete({ where: { id } });
    }

}
