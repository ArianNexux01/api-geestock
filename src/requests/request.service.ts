import { Injectable } from '@nestjs/common';
import { CreateRequestDTO } from './dto/create-request.dto';
import { UpdateRequestDTO } from './dto/update-request.dto';
import { RequestDao } from './request.dao';

import { PieceDao } from 'src/pieces/piece.dao';
import { AcceptRequestDTO } from './dto/accept-request.dto';
import { InvoiceReciepmentDao } from '../invoice/invoice.dao';
import { LogsActivitiesDao } from 'src/logs-activities/logs-activities.dao';
import { AlertsDao } from 'src/alerts/alerts.dao';
import { EmailService } from 'src/email/email.service';

enum RequestStatus {
  ONGOING = "Em curso",
  FINISHED = "Finalizada"
}

@Injectable()
export class RequestService {
  constructor(
    private requestsDao: RequestDao,
    private invoiceRecipment: InvoiceReciepmentDao,
    private pieceDao: PieceDao,
    private logsActivitiesDao: LogsActivitiesDao,
    private alertsDao: AlertsDao,
    private emailService: EmailService

  ) { }
  async create(createPieceDto: CreateRequestDTO) {
    await this.requestsDao.create(createPieceDto);
    await this.logsActivitiesDao.create({
      userId: createPieceDto.userId,
      description: `Realizou uma requisição com numero de PR ${createPieceDto.numberPr}`
    })
  }

  async findAll(searchParam: string) {
    const requests = await this.requestsDao.list(searchParam);

    return requests;
  }

  async findOne(id: string) {
    return await this.requestsDao.find(id);
  }

  async update(id: string, updateRequestDto: UpdateRequestDTO) {
    await this.requestsDao.update(id, updateRequestDto);
    await this.logsActivitiesDao.create({
      userId: updateRequestDto.userId,
      description: `Actualizou uma requisição com numero de PR ${updateRequestDto.numberPr}`
    })
  }

  async remove(id: string) {
    await this.requestsDao.delete(id);
  }

  async findByWarehouseIncommingId(id: string, searchParam: string) {
    return await this.requestsDao.findByIncommingWarehouse(id, searchParam)
  }

  async findByWarehouseOutcommingId(id: string, searchParam: string) {
    return await this.requestsDao.findByOutcommingWarehouse(id, searchParam)
  }

  async acceptRequest(id: string, requestData: AcceptRequestDTO): Promise<any> {
    await this.emailService.sendMail("bentojulio2022@gmail.com", "REQUISIÇÃO ACEITE", "ESTA REQUISICAO FOI ACEITE COM SUCESSO")
    /**
     * 
     * WarehouseIncomming o armazem que recebe a requisição
     * WarehouseOutcomming o armazem que envia a requisição
     * Out saida de requisicao ||| In entrada de requisição
     */
    const request = await this.requestsDao.find(id)
    let isRequestFinished = false
    let piecesOfRequest !: any
    const returnmentData = []
    for (let piece of requestData.pieceData) {
      let sumQuantityGiven: number = piece.quantityGiven
      const pieceData = await this.pieceDao.find(piece.pieceId)
      const requestPiece = await this.requestsDao.findByRequestAndPieceId(id, piece.pieceId)
      //if( pieceData.quantity < piece.quantityGiven) throw new Error("Quantity must be Less than quantity given")
      const leftQuantityOfPieces = pieceData.quantity - Number(piece.quantityGiven)
      await this.pieceDao.updateQuantity(piece.pieceId, leftQuantityOfPieces)

      if (pieceData.target >= leftQuantityOfPieces) {
        this.alertsDao.create({
          description: `A Peça ${pieceData.name} atingiu o set target.`,
          pieceId: pieceData.id,
          warehouseId: request.warehouseOutcomming.id
        })
        await this.emailService.sendMail("bentojulio2022@gmail.com", "PEÇA ATINGIU O SEU TARGET", `A Peça ${pieceData.name} atingiu o set target.`)
      }

      if (pieceData.min >= leftQuantityOfPieces) {
        this.alertsDao.create({
          description: `A Peça ${pieceData.name} atingiu a sua quantidade mínina.`,
          pieceId: pieceData.id,
          warehouseId: request.warehouseOutcomming.id
        })
        await this.emailService.sendMail("bentojulio2022@gmail.com", "PEÇA ATINGIU A SUA QUANTIDADE MINIMA", `A Peça ${pieceData.name} atingiu a sua quantidade mínina.`)

      }
      piecesOfRequest = await this.pieceDao.findByPartNumberAndWarehouse(request.warehouseIdOutcomming, pieceData.partNumber)


      if (piecesOfRequest !== null) {
        sumQuantityGiven = Number(piecesOfRequest.quantity) + Number(piece.quantityGiven)
        console.log(piecesOfRequest.quantity, Number(piece.quantityGiven))


        await this.pieceDao.updateQuantity(piecesOfRequest.id, sumQuantityGiven)
      } else {
        piecesOfRequest = await this.pieceDao.create({
          name: pieceData.name,
          brand_name: pieceData.brand_name,
          description: pieceData.description,
          price: pieceData.price,
          state: pieceData.state,
          partNumber: pieceData.partNumber,
          locationInWarehouse: pieceData.locationInWarehouse,
          target: pieceData.target,
          min: pieceData.min,
          quantity: Number(piece.quantityGiven),
          warehouse: {
            connect: {
              id: request.warehouseIdOutcomming
            }
          },
          category: {
            connect: {
              id: pieceData.categoryId
            }
          },
          subcategory: {
            connect: {
              id: pieceData.subCategoryId
            }
          },
          supplier: {
            connect: {
              id: pieceData.supplierId
            }
          },
        })

      }


      piece.number_series.forEach(async (nseries) => {
        console.log(nseries)
        await this.invoiceRecipment.create({
          description: pieceData.description,
          partNumber: pieceData.partNumber,
          requestPieceId: requestPiece.id,
          numberSeries: nseries
        })
        returnmentData.push({
          pieceName: pieceData.name,
          description: pieceData.description,
          partNumber: pieceData.partNumber,
          numberSeries: nseries,
          requestPieceId: piece.pieceId,
          price: pieceData.price,
          quantity: pieceData.quantity
        })

      })



      //Validar o numero de peças pretendido e o numero de peças dado

      await this.requestsDao.updateQuantityGivenInRequestPieces(requestPiece.id, sumQuantityGiven)

      isRequestFinished = requestPiece.quantity == piece.quantityGiven
    }
    await this.requestsDao.changeStateOfRequest(id, isRequestFinished ? RequestStatus.FINISHED : RequestStatus.ONGOING);
    const warehouseOutcomming = request.warehouseOutcomming.name
    const warehouseIncomming = request.warehouseIncomming.name

    await this.logsActivitiesDao.create({
      userId: requestData.userId,
      description: "Requisição aceite"
    })

    return {
      returnmentData,
      warehouseIncomming,
      warehouseOutcomming,
      numberPr: request.numberPr,
      createdAt: request.created_at,
    }
  }

  async getInvoices() {
    return await this.invoiceRecipment.list('')
  }


}
