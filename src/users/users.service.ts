import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersDao } from './users.dao';
import { hash } from 'bcryptjs';
import { v4 as uuid } from 'uuid';
@Injectable()
export class UsersService {
  constructor(private usersDao: UsersDao) { }
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await hash(createUserDto.password, 4);
    createUserDto.id = uuid();
    await this.usersDao.create(createUserDto);

  }

  async findAll() {
    const users = await this.usersDao.list();
    const usersToReturn = users.map(e => ({
      id: e.id,
      name: e.name,
      position: e.position,
      company: e.company,
      email: e.email,
      warehouse: e.warehouse,
      created_at: e.created_at,
      updated_at: e.updated_at
    }))
    return usersToReturn;
  }

  async findOne(id: string) {
    return await this.usersDao.find(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.usersDao.update(id, updateUserDto);

  }

  async remove(id: string) {
    await this.usersDao.delete(id);
  }
}
