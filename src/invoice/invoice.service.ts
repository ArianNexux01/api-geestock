import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceReciepmentDao } from './invoice.dao';

@Injectable()
export class InvoiceService {
  constructor(private invoiceDao: InvoiceReciepmentDao) { }
  create(createInvoiceDto: CreateInvoiceDto) {
    return 'This action adds a new invoice';
  }

  async findAll(requestId: string) {
    const response = await this.invoiceDao.list(requestId);

    const returnmentData = response.map(e => ({
      pieceName: e.RequestPieces.PiecesWarehouse.Piece.name,
      description: e.RequestPieces.PiecesWarehouse.Piece.description,
      partNumber: e.RequestPieces.PiecesWarehouse.Piece.partNumber,
      numberSeries: e.number_series,
      requestPieceId: e.requestPiecesId,
      quantity: e.quantity,
      quantityGiven: e.quantityGiven,
      price: e.RequestPieces.PiecesWarehouse.Piece.price,
    }))

    const dataToBeReturned = {
      returnmentData,
      warehouseIncomming: response[0].RequestPieces.request.warehouseIncomming.name,
      warehouseOutcomming: response[0].RequestPieces.request.warehouseOutcomming.name,
      numberPr: response[0].RequestPieces.request.numberPr,
      createdAt: response[0].created_at,
    }

    return dataToBeReturned
  }

  async findAllInvoiceReceipment() {
    const data = await this.invoiceDao.listRequestPieces("")

    return data
  }
  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
