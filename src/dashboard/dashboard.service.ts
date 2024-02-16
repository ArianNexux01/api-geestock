import { Injectable } from '@nestjs/common';
import { OrderDao } from '../orders/order.dao';
import { PieceDao } from '../pieces/piece.dao';
import { RequestDao } from '../requests/request.dao';
import { WarehouseDao } from '../warehouse/warehouse.dao';


@Injectable()
export class DashboardService {
    constructor(
        private requestDao: RequestDao,
        private warehouseDao: WarehouseDao,
        private orderDao: OrderDao,
        private pieceDao: PieceDao
    ) {

    }
    async findAll() {
        const result = {
            request: await this.requestDao.count(),
            warehouse: await this.warehouseDao.count(),
            order: await this.orderDao.count(),
            piece: await this.pieceDao.count(),
        }

        return result
    }


}
