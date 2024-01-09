import { Prisma, Users } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.UsersCreateInput): Promise<any> {

        return this.prisma.users.create({ data });
    }

    async list(): Promise<any[]> {
        const users = await this.prisma.users.findMany({
            include: {
                warehouse: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        code: true,
                    }
                }
            }
        });

        return users;
    }

    async find(id: string): Promise<any> {
        const res = this.prisma.users.findFirst({
            where: { id },
            include: {
                warehouse: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        code: true,
                    }
                }
            }
        });

        return res
    }

    async update(id: string, data: Users): Promise<Users> {
        const user = this.prisma.users.update({ where: { id }, data });
        return user
    }

    async delete(id: string): Promise<Users> {
        return this.prisma.users.delete({ where: { id } });
    }

    async findByEmail(email: string): Promise<any> {
        const userFoundByEmail = await this.prisma.users.findFirst({
            where: { email },
            include: {
                warehouse: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        code: true,
                    }
                }
            }
        })
        if (!userFoundByEmail) {
            throw new Error("Email não encontrado!")
        }
        return userFoundByEmail
    }
}
