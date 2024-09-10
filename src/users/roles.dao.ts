import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
@Injectable()
export class RolesDao {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<any[]> {
    const roles = await this.prisma.roles.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return roles;
  }

  async findById(id: string): Promise<any> {
    const role = await this.prisma.roles.findUnique({
      where: {
        id: id,
      },
    });

    return role;
  }
}
