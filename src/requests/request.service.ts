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
  ONGOING = "finalizada parcialmente",
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

    const allQuantityAreGreaterThanQuantityRequested = createPieceDto.request.filter(e => e.quantity < e.quantityRequested)

    if (allQuantityAreGreaterThanQuantityRequested.length > 0) {
      throw new Error("Quantity must be greater than QuantityRequested");
    }


    createPieceDto.request = createPieceDto.request.map((dto) => {
      const fakeQuantity = dto.quantity - dto.quantityRequested
      this.pieceDao.updateQuantity(dto.pieceId, fakeQuantity)
      return {
        ...dto,
        quantity: fakeQuantity
      }
    })

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
      let sumQuantityGiven = Number(piece.quantityGiven)
      let totalQuantityGiven = Number(piece.quantityGiven) - Number(piece.number_series.length)


      let pieceData = await this.pieceDao.find(piece.pieceId)
      const requestPiece = await this.requestsDao.findByRequestAndPieceId(id, piece.pieceId)
      pieceData = await this.pieceDao.updateQuantity(pieceData.id, Number(Number(pieceData.quantity) + Number(requestPiece.quantity)))
      const leftQuantityOfPieces = Number(pieceData.quantity) - Number(piece.quantityGiven)
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
      let finalQuantity = Number(piece.quantityGiven) - piece.number_series.length

      console.log("DEBUG", finalQuantity, piece.quantityGiven, piece.number_series)
      await this.invoiceRecipment.create({
        description: pieceData.description,
        partNumber: pieceData.partNumber,
        requestPieceId: requestPiece.id,
        numberSeries: "N/A",
        quantity: Number(finalQuantity),
        quantityGiven: Number(piece.quantityGiven)
      })

      returnmentData.push({
        pieceName: pieceData.name,
        description: pieceData.description,
        partNumber: pieceData.partNumber,
        numberSeries: "N/A",
        requestPieceId: piece.pieceId,
        price: pieceData.price,
        quantity: Number(finalQuantity)
      })


      piece.number_series.forEach(async (nseries) => {
        await this.invoiceRecipment.create({
          description: pieceData.description,
          partNumber: pieceData.partNumber,
          requestPieceId: requestPiece.id,
          created_at: requestPiece.created_at,
          numberSeries: nseries,
          quantity: 1
        })
        returnmentData.push({
          pieceName: pieceData.name,
          description: pieceData.description,
          partNumber: pieceData.partNumber,
          numberSeries: nseries,
          requestPieceId: piece.pieceId,
          price: pieceData.price,
          quantity: 1
        })
      })
      //Validar o numero de peças pretendido e o numero de peças dado

      await this.requestsDao.updateQuantityGivenInRequestPieces(requestPiece.id, Number(piece.quantityGiven))

      isRequestFinished = piece.quantityGiven >= requestPiece.quantity
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

  async findByState(state: string) {
    return await this.requestsDao.findByState(state)
  }

  async revert(id: string) {
    let request = await this.requestsDao.find(id)

    request.RequestsPieces.forEach(async (requestPiece) => {
      const piece = await this.pieceDao.find(requestPiece.pieceId)
      this.pieceDao.updateQuantity(piece.id, requestPiece.quantity + piece.quantity)
    })

    this.requestsDao.changeStateOfRequest(id, "Rejeitada")
    request = await this.findAll('')

    return request
  }

}
