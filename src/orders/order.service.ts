import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderDao } from './order.dao';
import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { PieceDao } from 'src/pieces/piece.dao';
import { ConfirmOrderDTO } from './dto/confirm-order.dto';
@Injectable()
export class OrderService {
  constructor(private orderDao: OrderDao, private pieceDao: PieceDao) { }
  async create(createOrderDto: CreateOrderDto) {
    await this.orderDao.create(createOrderDto);

  }

  async findAll() {
    const order = await this.orderDao.list();

    return order;
  }

  async findOne(id: string) {
    return await this.orderDao.find(id);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.orderDao.update(id, { ...updateOrderDto });
  }

  async remove(id: string) {
    await this.orderDao.delete(id);
  }

  async confirmOrder(orderId: string, confirmOrder: ConfirmOrderDTO) {
    // const order = await this.orderDao.find(orderId);

    for (const item of confirmOrder.pieceData) {
      const oldPrice = (await this.pieceDao.find(item.pieceId))?.price
      if (oldPrice) {
        await this.pieceDao.increaseQuantity(item.pieceId, Number(item.quantity))
        await this.orderDao.changeStateAndPrice(orderId, Number(item.priceOfEachPiece), "Finalizada", item.pieceId)
        await this.pieceDao.updatePrice(item.pieceId, (Number(oldPrice) + Number(item.priceOfEachPiece)) / 2)
      }
    }  
  }
}
