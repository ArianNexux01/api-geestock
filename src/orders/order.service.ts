import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderDao } from './order.dao';

import { PieceDao } from 'src/pieces/piece.dao';
import { ConfirmOrderDTO } from './dto/confirm-order.dto';
import { LogsActivitiesDao } from 'src/logs-activities/logs-activities.dao';
import { AlertsDao } from 'src/alerts/alerts.dao';
@Injectable()
export class OrderService {
  constructor(
    private orderDao: OrderDao,
    private pieceDao: PieceDao,
    private logsActivitiesDao: LogsActivitiesDao,
    private alertsDao: AlertsDao
  ) { }
  async create(createOrderDto: CreateOrderDto) {
    await this.orderDao.create(createOrderDto);
    await this.logsActivitiesDao.create({
      userId: createOrderDto.userId,
      description: `Realizou uma encomenda com o número ${createOrderDto.number_order}`
    })
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
    await this.logsActivitiesDao.create({
      userId: updateOrderDto.userId,
      description: `Actualizou uma encomenda com o numero ${updateOrderDto.number_order}`
    })
  }

  async remove(id: string) {
    await this.orderDao.delete(id);

  }

  async confirmOrder(orderId: string, confirmOrder: ConfirmOrderDTO) {
    // const order = await this.orderDao.find(orderId);

    for (const item of confirmOrder.pieceData) {
      const findPiece = await this.pieceDao.find(item.pieceId)
      if (findPiece) {
        const pieceFound = await this.pieceDao.increaseQuantity(item.pieceId, Number(item.quantity))
        await this.orderDao.changeStateAndPrice(orderId, Number(item.priceOfEachPiece), "Finalizada", item.pieceId)
        await this.pieceDao.updatePrice(item.pieceId, (Number(pieceFound.price) + Number(item.priceOfEachPiece)) / 2)
      }
    }

    await this.logsActivitiesDao.create({
      userId: confirmOrder.userId,
      description: "Encomenda confirmada"
    })
  }
}
