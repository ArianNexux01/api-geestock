import { Prisma, Users } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateUserDto): Promise<any> {
        const warehouseIds = data.warehouseId.map(id => ({ warehouseId: id }))
        console.log(warehouseIds);
        return this.prisma.users.create({
            data: {

                name: data.name,
                email: data.email,
                company: data.company,
                position: data.position,
                password: data.password,
                warehouse: {
                    create: warehouseIds
                }
            }
        });

    }
    async list(searchParam: string): Promise<any[]> {

        if (searchParam !== "" && searchParam !== undefined) {
            const users = await this.prisma.users.findMany({
                where: {
                    OR: [
                        {
                            email: {
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
                include: {
                    warehouse: {
                        include: {
                            Warehouse: {
                                select: {
                                    id: true,
                                    name: true,
                                    type: true,
                                    code: true,
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            return users;
        }
        const users = await this.prisma.users.findMany({
            include: {
                warehouse: {
                    include: {
                        Warehouse: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                code: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return users;
    }

    async find(id: string): Promise<any> {
        const res = this.prisma.users.findFirst({
            where: { id },
            include: {
                warehouse: {
                    include: {
                        Warehouse: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                code: true,
                            }
                        }
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
                    include: {
                        Warehouse: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                code: true,
                            }
                        }
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
