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
    private alertsDao: AlertsDao,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    await this.logsActivitiesDao.create({
      userId: createOrderDto.userId,
      description: `Realizou uma encomenda com o número ${createOrderDto.number_order}`,
    });
    delete createOrderDto.userId;
    await this.orderDao.create(createOrderDto);
  }

  async findAll(searchParam: string, warehouseId: string, state: string) {
    let order: any = [];
    let orderNew: any = [];
    if (
      warehouseId !== undefined &&
      warehouseId !== '' &&
      warehouseId !== 'Todos'
    ) {
      let orderWithWarehouseId = await this.orderDao.listByWarehouseInCommingId(
        warehouseId,
        searchParam,
        state,
      );
      console.log(orderWithWarehouseId);
      order.push(...orderWithWarehouseId);
    }
    orderNew = await this.orderDao.list(searchParam, state);
    order.push(...orderNew);

    return order;
  }

  async findOne(id: string, warehouseId: string) {
    return await this.orderDao.findByWarehouseId(id, warehouseId);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.orderDao.update(id, { ...updateOrderDto });
    await this.logsActivitiesDao.create({
      userId: updateOrderDto.userId,
      description: `Actualizou uma encomenda com o numero ${updateOrderDto.number_order}`,
    });
  }

  async remove(id: string) {
    await this.orderDao.delete(id);
  }

  async confirmOrder(
    orderId: string,
    confirmOrder: ConfirmOrderDTO,
    token: any,
  ) {
    const statusOrder = Boolean(confirmOrder.isPartial)
      ? 'Finalizada Parcialmente'
      : 'Finalizada';
    let quantityAll = 0;
    for (const item of confirmOrder.pieceData) {
      const order = await this.orderDao.findByWarehouseId(orderId, '');
      const findPiece = await this.pieceDao.find(item.pieceId);
      if (findPiece) {
        const hasThisPieceInWarehouse =
          await this.pieceDao.findByWarehouseAndPiece(
            item.pieceId,
            confirmOrder.warehouseId,
          );
        const quantityGeneral = await this.pieceDao.getQuantityOfAllPieces(
          findPiece.partNumber,
        );
        quantityAll = Number(quantityGeneral) + Number(item.quantity);

        if (hasThisPieceInWarehouse) {
          let finalQuantity: number =
            Number(hasThisPieceInWarehouse.quantity) + Number(item.quantity);
          await this.pieceDao.increaseQuantity(
            item.pieceId,
            confirmOrder.warehouseId,
            finalQuantity,
            item.locationInWarehouse,
          );
        } else {
          await this.pieceDao.createPieceInWarehouse({
            pieceId: item.pieceId,
            locationInWarehouse: item.locationInWarehouse,
            quantity: item.quantity,
            warehouseId: confirmOrder.warehouseId,
          });
        }
        await this.orderDao.changeStateAndPrice(
          orderId,
          statusOrder,
          item.pieceId,
          item.quantity,
        );
        if (order.requestId === null || order.requestId === '') {
          const upNumber = Number(quantityGeneral) * Number(findPiece.price);
          const downNumber = Number(item.quantity) * Number(item.price);
          const middleNumber = upNumber + downNumber;
          const mediumPrice = (middleNumber / quantityAll).toFixed(2);

          await this.pieceDao.updatePrice(item.pieceId, Number(mediumPrice));
        }
      }
    }
    await this.logsActivitiesDao.create({
      userId: confirmOrder.userId,
      description: 'Encomenda confirmada',
    });
  }
}
