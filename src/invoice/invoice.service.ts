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
      pieceName: e.request.piece.name,
      description: e.request.piece.description,
      partNumber: e.partNumber,
      numberSeries: e.number_series,
      requestPieceId: e.requestPiecesId,
      quantity: e.request.quantityGiven,
      price: e.request.piece.price,
    }))

    console.log(returnmentData)

    return {
      returnmentData,
      warehouseIncomming: "W1",
      warehouseOutcomming: "w2",
      numberPr: response[0].request.numberPr,
      createdAt: new Date()
    }
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
