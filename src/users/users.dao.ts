import { Prisma, Users } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateUserDto): Promise<any> {
        const warehouseIds = data.warehouse?.map(id => ({ warehouseId: id }))
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
    async list(searchParam: string, onlyActive: number): Promise<any[]> {

        let where = {}
        if (searchParam !== "" && searchParam !== undefined) {
            where = {
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
            };
        }
        console.log("Ola mundo: " + searchParam, onlyActive == 1, onlyActive)

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
                            email: {
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
            const users = await this.prisma.users.findMany({
                where,
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

    async resetPassword(id: string) {
        const passwordDefault = "$2a$12$rwmpidY6LCjFeyCxatx3iOXTwhSwUe2ku/4ZPA7Jfh25y.ZojDy/S"

        const user = await this.prisma.users.update({
            where: { id }, data: {
               password: passwordDefault
            }
        });
    }

    async update(id: string, data: UpdateUserDto): Promise<Users> {
        const warehouseIds = data?.warehouse?.map(e => {


            return {
                warehouseId: e
            }
        })

        await this.prisma.usersWarehouse.deleteMany({
            where: { usersId: id }
        });
        const user = await this.prisma.users.update({
            where: { id }, data: {

                ...data,
                warehouse: {
                    create: warehouseIds
                }

            }
        });
        return user
    }

    async delete(id: string): Promise<Users> {
        return this.prisma.users.delete({ where: { id } });
    }

    async findByEmail(email: string): Promise<any> {
        const userFoundByEmail = await this.prisma.users.findFirst({
            where: {
                email,
                isActive: true
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
                                isActive: true
                            },
                            where: {
                                isActive: true
                            }
                        }
                    }
                }
            },
        })
        if (!userFoundByEmail) {
            throw new Error("Email não encontrado!")
        }
        return userFoundByEmail
    }
    async changeStatus(id: string, status: number): Promise<any> {
        return await this.prisma.users.update({
            where: { id: id },
            data: {
                isActive: status == 1
            }
        })
    }
}
