import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderDao } from './order.dao';
import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { PieceDao } from 'src/pieces/piece.dao';
@Injectable()
export class OrderService {
  constructor(private orderDao: OrderDao, private pieceDao: PieceDao) { }
  async create(createOrderDto: CreateOrderDto) {
    await this.orderDao.create(createOrderDto);
    await this.pieceDao.increaseQuantity(createOrderDto.pieceId, createOrderDto.quantity)
  }

  async findAll() {
    const order = await this.orderDao.list();
    const orderToReturn = order.map(e => ({
      id: e.id,
      description: e.description,
      pieceId: e.pieceId,
      imbl_awb: e.imbl_awb,
      quantity: e.quantity,
      created_at: e.created_at,
      updated_at: e.updated_at
    }))

    return orderToReturn;
  }

  async findOne(id: string) {
    await this.orderDao.find(id);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.orderDao.update(id, updateOrderDto);
  }

  async remove(id: string) {
    await this.orderDao.delete(id);
  }
}
