import { Injectable } from '@nestjs/common';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';
import { PieceDao } from './piece.dao';
import { LogsActivitiesDao } from 'src/logs-activities/logs-activities.dao';
@Injectable()
export class PieceService {
  constructor(
    private piecesDao: PieceDao,
    private logsActivitiesDao: LogsActivitiesDao
  ) {

  }
  async create(createPieceDto: CreatePieceDto) {
    await this.logsActivitiesDao.create({
      userId: createPieceDto.userId,
      description: `Criou a peça ${createPieceDto.name} com o PartNumber ${createPieceDto.partNumber}`
    })
    delete createPieceDto.userId
    await this.piecesDao.create(createPieceDto);
  }

  async findAll(searchParam: string) {
    const pieces = await this.piecesDao.list(searchParam);
    const piecesToReturn = pieces.map(e => ({
      id: e.id,
      name: e.name,
      description: e.description,
      quantity: e.quantity,
      price: e.price,
      state: e.state,
      brand_name: e.brand_name,
      supplierId: e.supplierId,
      partNumber: e.partNumber,
      warehouseId: e.warehouseId,
      categoryId: e.categoryId,
      subCategoryId: e.subCategoryId,
      locationInWarehouse: e.locationInWarehouse,
      target: e.target,
      min: e.min,
      created_at: e.created_at,
      updated_at: e.updated_at
    }))
    return piecesToReturn;
  }

  async findOne(id: string) {
    return await this.piecesDao.find(id);
  }

  async update(id: string, updatePieceDto: UpdatePieceDto) {
    await this.logsActivitiesDao.create({
      userId: updatePieceDto.userId,
      description: `Actualizou a peça ${updatePieceDto.name} com o PartNumber ${updatePieceDto.partNumber}`
    })
    delete updatePieceDto.userId
    return await this.piecesDao.update(id, updatePieceDto);
  }

  async remove(id: string) {
    await this.piecesDao.delete(id);
  }
  async findByWarehouse(id: string, searchParam: string) {
    return await this.piecesDao.findByWarehouseId(id, searchParam)
  }
}
