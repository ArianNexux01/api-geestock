import { Injectable } from '@nestjs/common';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';
import { PieceDao } from './piece.dao';
import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
@Injectable()
export class PieceService {
  constructor(private piecesDao: PieceDao) { }
  async create(createPieceDto: CreatePieceDto) {
    await this.piecesDao.create(createPieceDto);
  }

  async findAll() {
    const pieces = await this.piecesDao.list();
    const piecesToReturn = pieces.map(e => ({
      id: e.id,
      name: e.name,
      description: e.description,
      quantity: e.quantity,
      price: e.price,
      state: e.state,
      brand_name: e.brand_name,
      supplierId: e.supplierId,
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
    return await this.piecesDao.update(id, updatePieceDto);
  }

  async remove(id: string) {
    await this.piecesDao.delete(id);
  }
  async findByWarehouse(id: string) {
    return await this.piecesDao.findByWarehouseId(id)
  }
}
