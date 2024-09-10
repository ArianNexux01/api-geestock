import { Injectable } from '@nestjs/common';
import { OrderDao } from '../orders/order.dao';
import { PieceDao } from '../pieces/piece.dao';
import { RequestDao } from '../requests/request.dao';
import { WarehouseDao } from '../warehouse/warehouse.dao';
import { PieceService } from 'src/pieces/piece.service';
import { OrderService } from 'src/orders/order.service';
import { RequestService } from 'src/requests/request.service';

@Injectable()
export class DashboardService {
  constructor(
    private requestDao: RequestDao,
    private warehouseDao: WarehouseDao,
    private orderService: OrderService,
    private pieceDao: PieceDao,
    private requestService: RequestService,
    private pieceService: PieceService,
  ) {}
  async findAll() {
    const price = await this.pieceService.findAll('', 1, 1);
    let totalPrice = price.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.price * currentValue.quantity,
      0,
    );

    const requestOutcomming =
      await this.requestService.getByStateWarehouseOutcomming(
        'Em Curso',
        'Todos',
      );

    const resultOfOrder = (
      await this.orderService.findAll('', 'Todos', 'Em Curso')
    ).length;
    const result = {
      request: requestOutcomming.length,
      warehouse: await this.warehouseDao.count(),
      order: resultOfOrder,
      piece: await this.pieceDao.count(undefined),
      totalPrice,
    };

    return result;
  }

  async findAllByUser(warehouseId: string) {
    const requestOutcomming =
      await this.requestService.getByStateWarehouseOutcomming(
        'Em Curso',
        warehouseId,
      );

    const price = await this.pieceService.findByWarehouse(warehouseId, '');
    let totalPrice = price.reduce(
      (accumulator, currentValue) => accumulator + currentValue.totalPrice,
      0,
    );
    const resultOfOrder = await this.orderService.findAll(
      '',
      warehouseId,
      'Em Curso',
    );
    const result = {
      request: requestOutcomming.length,
      warehouse: 0,
      order: resultOfOrder.length,
      piece: await this.pieceDao.count(warehouseId),
      totalPrice,
    };

    return result;
  }
}
