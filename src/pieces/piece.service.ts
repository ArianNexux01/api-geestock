import { Injectable } from '@nestjs/common';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';
import { PieceDao } from './piece.dao';
import { LogsActivitiesDao } from 'src/logs-activities/logs-activities.dao';
@Injectable()
export class PieceService {
  constructor(
    private piecesDao: PieceDao,
    private logsActivitiesDao: LogsActivitiesDao,
  ) {}
  async create(createPieceDto: CreatePieceDto) {
    await this.logsActivitiesDao.create({
      userId: createPieceDto.userId,
      description: `Criou a peça ${createPieceDto.name} com o PartNumber ${createPieceDto.partNumber}`,
    });
    delete createPieceDto.userId;
    await this.piecesDao.create(createPieceDto);
  }

  async findAll(
    searchParam: string,
    onlyActive: number,
    onlyWithQuantity: number,
  ) {
    const pieces = await this.piecesDao.list(searchParam, onlyActive);
    let totalPrice = 0;
    const piecesToReturn = [];
    pieces.forEach(async (e) => {
      const sumQuantity = e.PiecesWarehouse.reduce(
        (accumulator, currentValue) => accumulator + currentValue.quantity,
        0,
      );

      totalPrice = sumQuantity * e.price;
      if (totalPrice <= 0 && onlyWithQuantity == 1) {
        return;
      }

      piecesToReturn.push({
        id: e.id,
        name: e.name,
        description: e.description,
        quantity: sumQuantity,
        price: e.price,
        state: e.state,
        brand_name: e.brand_name,
        partNumber: e.partNumber,
        isActive: e.isActive,
        target: e.target,
        min: e.min,
        supplierId: e.supplierId,
        warehouseId: e.warehouseId,
        created_at: e.created_at,
        updated_at: e.updated_at,
        totalPrice: totalPrice,
      });
    });
    return piecesToReturn;
  }

  async findOne(id: string) {
    return await this.piecesDao.find(id);
  }

  async update(id: string, updatePieceDto: UpdatePieceDto) {
    await this.logsActivitiesDao.create({
      userId: updatePieceDto.userId,
      description: `Actualizou a peça ${updatePieceDto.name} com o PartNumber ${updatePieceDto.partNumber}`,
    });
    delete updatePieceDto.userId;
    return await this.piecesDao.update(id, updatePieceDto);
  }

  async remove(id: string) {
    await this.piecesDao.delete(id);
  }
  async findByWarehouse(id: string, searchParam: string) {
    let returnedData = await this.piecesDao.findByWarehouseId(id, searchParam);

    returnedData = returnedData.map((data) => ({
      ...data,
      supplierId: data.Piece.supplierId,
      name: data.Piece.name,
      partNumber: data.Piece.partNumber,
      description: data.Piece.description,
      price: data.Piece.price,
      totalPrice: data.Piece.price * data.quantity,
    }));

    return returnedData;
  }

  async changeStatus(id: string, status: number) {
    await this.piecesDao.changeStatus(id, status);
  }

  async updateWarehousePieceLocation(id: string, location: string) {
    await this.piecesDao.updateWarehousePieceLocation(id, location);
  }
}
