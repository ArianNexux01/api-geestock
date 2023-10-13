import { Prisma, Users } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.UsersCreateInput): Promise<any> {

        return this.prisma.users.create({ data });
    }

    async list(): Promise<Users[]> {
        const users = await this.prisma.users.findMany();

        return users;
    }

    async find(id: string): Promise<Users | null> {
        return this.prisma.users.findFirst({ where: { id } });
    }

    async update(id: string, data: Users): Promise<Users> {
        const user = this.prisma.users.update({ where: { id }, data });
        console.log(user)
        return user
    }

    async delete(id: string): Promise<Users> {
        return this.prisma.users.delete({ where: { id } });
    }

    async findByEmail(email: string): Promise<Users> {
        const userFoundByEmail = await this.prisma.users.findFirst({
            where: { email },
        })
        console.log("USER FOUND", userFoundByEmail)
        return userFoundByEmail
    }
}
