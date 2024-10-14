import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersDao } from './users.dao';
import { hash } from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { RolesDao } from './roles.dao';
@Injectable()
export class UsersService {
  constructor(private usersDao: UsersDao, private rolesDao: RolesDao) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await hash('12345', 4);
    createUserDto.id = uuid();
    await this.usersDao.create(createUserDto);
  }

  async findAll(searchParam: string, onlyActive: number) {
    const users = await this.usersDao.list(searchParam, onlyActive);
    const usersToReturn = users.map((e) => ({
      id: e.id,
      name: e.name,
      position: e.position,
      company: e.company,
      email: e.email,
      warehouse: e.warehouse.Warehouse,
      isActive: e.isActive,
      created_at: e.created_at,
      updated_at: e.updated_at,
    }));
    return usersToReturn;
  }

  async findOne(id: string) {
    const foundUser = await this.usersDao.find(id);
    return {
      ...foundUser,
      warehouse: foundUser?.warehouse,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password !== undefined) {
      updateUserDto.password = await hash(updateUserDto.password, 4);
    }
    await this.usersDao.update(id, updateUserDto);
  }

  async remove(id: string) {
    await this.usersDao.delete(id);
  }

  async changeStatus(id: string, status: number) {
    await this.usersDao.changeStatus(id, status);
  }

  async resetPassword(id: string) {
    await this.usersDao.resetPassword(id);
  }
  async listRoles() {
    const data = await this.rolesDao.list();
    return data;
  }
}
