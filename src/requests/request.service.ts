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
import { OrderDao } from 'src/orders/order.dao';

enum RequestStatus {
  ONGOING = 'finalizada parcialmente',
  FINISHED = 'Finalizada',
}

@Injectable()
export class RequestService {
  constructor(
    private requestsDao: RequestDao,
    private invoiceRecipment: InvoiceReciepmentDao,
    private pieceDao: PieceDao,
    private orderDao: OrderDao,
    private logsActivitiesDao: LogsActivitiesDao,
    private alertsDao: AlertsDao,
    private emailService: EmailService,
  ) {}
  async create(createPieceDto: CreateRequestDTO) {
    const allQuantityAreGreaterThanQuantityRequested =
      createPieceDto.request.filter((e) => e.quantity < e.quantityRequested);

    if (allQuantityAreGreaterThanQuantityRequested.length > 0) {
      throw new Error('Quantity must be greater than QuantityRequested');
    }

    createPieceDto.request = createPieceDto.request.map((dto) => {
      const fakeQuantity = Number(dto.quantity) - Number(dto.quantityRequested);
      this.pieceDao.updateQuantity(dto.pieceId, fakeQuantity);
      return {
        ...dto,
        quantity: fakeQuantity,
      };
    });

    await this.requestsDao.create(createPieceDto);

    await this.logsActivitiesDao.create({
      userId: createPieceDto.userId,
      description: `Realizou uma requisição com numero de PR ${createPieceDto.numberPr}`,
    });
  }

  async findAll(searchParam: string) {
    const requests = await this.requestsDao.list(searchParam);

    return requests;
  }

  async findOne(id: string) {
    const data = await this.requestsDao.find(id);

    let dataToBeReturned = data;
    const piecesWithNewPrice = [];
    if (data?.RequestsPieces !== null && data?.RequestsPieces !== undefined)
      for (const request of data.RequestsPieces) {
        let pieceData = await this.pieceDao.findByWarehouseAndPiece(
          request.PiecesWarehouse.Piece.id,
          data.warehouseOutcomming.id,
        );
        piecesWithNewPrice.push({
          ...request,
          id: request.PiecesWarehouse.id,
          name: request.PiecesWarehouse.Piece.name,
          price: request.PiecesWarehouse.Piece.price,
          partNumber: request.PiecesWarehouse.Piece.partNumber,
          locationInWarehouse: request.PiecesWarehouse.locationInWarehouse,
          quantityInStock: pieceData.quantity,
          quantityRequested: request.quantity,
        });
      }

    dataToBeReturned = {
      ...dataToBeReturned,
      RequestsPieces: piecesWithNewPrice,
    };
    return dataToBeReturned;
  }

  async update(id: string, updateRequestDto: UpdateRequestDTO) {
    await this.requestsDao.update(id, updateRequestDto);
    await this.logsActivitiesDao.create({
      userId: updateRequestDto.userId,
      description: `Actualizou uma requisição com numero de PR ${updateRequestDto.numberPr}`,
    });
  }

  async remove(id: string) {
    await this.requestsDao.delete(id);
  }

  async findByWarehouseIncommingId(id: string, searchParam: string) {
    return await this.requestsDao.findByIncommingWarehouse(id, searchParam);
  }

  async findByWarehouseOutcommingId(id: string, searchParam: string) {
    return await this.requestsDao.findByOutcommingWarehouse(id, searchParam);
  }

  async acceptRequest(id: string, requestData: AcceptRequestDTO): Promise<any> {
    // await this.emailService.sendMail("bentojulio2022@gmail.com", "REQUISIÇÃO ACEITE", "ESTA REQUISICAO FOI ACEITE COM SUCESSO")
    /**
     *
     * WarehouseIncomming o armazem que envia a requisição - PARA ONDE AS PEÇAS VÃO  - DESTINO
     * WarehouseOutcomming o armazem que recebe a requisição - DE ONDE AS PEÇAS VIRÃO - ORIGEM
     */
    const request = await this.requestsDao.find(id);
    let isRequestFinished = false;
    let orderPiecesData = [];
    const returnmentData = [];
    for (let piece of requestData.pieceData) {
      let totalQuantityGiven =
        Number(piece.quantityGiven) - Number(piece.number_series.length);

      let pieceData = await this.pieceDao.findPieceWarehouse(
        piece.pieceWarehouseId,
      );
      const requestPiece = await this.requestsDao.findByRequestAndPieceId(
        id,
        piece.pieceWarehouseId,
      );

      pieceData = await this.pieceDao.updateQuantity(
        pieceData.id,
        Number(Number(pieceData.quantity) + Number(requestPiece.quantity)),
      );

      const leftQuantityOfPieces =
        Number(pieceData.quantity) - Number(piece.quantityGiven);

      await this.pieceDao.updateQuantity(pieceData.id, leftQuantityOfPieces);

      this.createNotifications(pieceData, request);

      //So acontece se os dois armazens forem moveis um if aqui
      if (request.warehouseIncomming.type === 'Embarcação') {
        let piecesOfRequest = await this.pieceDao.findByPartNumberAndWarehouse(
          request.warehouseIncomming.id,
          pieceData.Piece.partNumber,
        );
        if (piecesOfRequest !== null) {
          let sumQuantityGiven =
            Number(piecesOfRequest.quantity) + Number(piece.quantityGiven);
          await this.pieceDao.updateQuantity(
            piecesOfRequest.id,
            sumQuantityGiven,
          );
        } else {
          piecesOfRequest = await this.pieceDao.createPieceInWarehouse({
            locationInWarehouse: pieceData.locationInWarehouse,
            quantity: Number(piece.quantityGiven),
            warehouseId: request.warehouseIncomming.id,
            pieceId: pieceData.Piece.id,
          });
        }
      }

      let finalQuantity =
        Number(piece.quantityGiven) - piece.number_series.length;
      if (finalQuantity > 0) {
        await this.invoiceRecipment.create({
          description: pieceData.Piece.description,
          partNumber: pieceData.Piece.partNumber,
          requestPieceId: requestPiece.id,
          numberSeries: 'N/A',
          quantity: Number(finalQuantity),
          quantityGiven: Number(piece.quantityGiven),
        });

        returnmentData.push({
          pieceName: pieceData.Piece.name,
          description: pieceData.Piece.description,
          partNumber: pieceData.Piece.partNumber,
          numberSeries: 'N/A',
          requestPieceId: requestPiece.id,
          price: pieceData.Piece.price,
          quantity: Number(finalQuantity),
        });
      }
      //So acontece se os dois armazens forem fixos um if aqui
      if (request.warehouseIncomming.type === 'Armazém') {
        orderPiecesData.push({
          pieceId: pieceData.Piece.id,
          quantity: Number(piece.quantityGiven),
          price: pieceData.Piece.price,
        });
      }

      piece.number_series.forEach(async (nseries) => {
        await this.invoiceRecipment.create({
          description: pieceData.Piece.description,
          partNumber: pieceData.Piece.partNumber,
          requestPieceId: requestPiece.id,
          created_at: requestPiece.created_at,
          numberSeries: nseries,
          quantity: 1,
        });
        returnmentData.push({
          pieceName: pieceData.Piece.name,
          description: pieceData.Piece.description,
          partNumber: pieceData.Piece.partNumber,
          numberSeries: nseries,
          requestPieceId: requestPiece.id,
          price: pieceData.Piece.price,
          quantity: 1,
        });
      });
      //Validar o numero de peças pretendido e o numero de peças dado
      await this.requestsDao.updateQuantityGivenInRequestPieces(
        requestPiece.id,
        Number(piece.quantityGiven),
      );
      isRequestFinished = piece.quantityGiven >= requestPiece.quantity;
    }

    await this.requestsDao.changeStateOfRequest(
      id,
      isRequestFinished ? RequestStatus.FINISHED : RequestStatus.ONGOING,
    );
    const warehouseOutcomming = request.warehouseOutcomming.name;
    const warehouseIncomming = request.warehouseIncomming.name;

    await this.logsActivitiesDao.create({
      userId: requestData.userId,
      description: 'Requisição aceite',
    });

    //So acontece se os dois armazens forem fixos um if aqui
    if (request.warehouseIncomming.type === 'Armazém') {
      await this.orderDao.create({
        request: orderPiecesData,
        description: 'ENC_INT ' + request.numberPr,
        number_order: request.numberPr,
        imbl_awb: request.numberPr,
        reference: request.numberPr,
        state: 'Em curso',
        requestId: request.id,
      });
    }

    return {
      returnmentData,
      warehouseIncomming,
      warehouseOutcomming,
      numberPr: request.numberPr,
      createdAt: request.created_at,
    };
  }
  async createNotifications(pieceData: any, request: any) {
    const quantityAllPiecesInWarehouseFix =
      await this.pieceDao.countQuantityAllPieces(pieceData.id);
    console.log(
      'STATE:',
      pieceData.Piece.target_notified,
      pieceData.Piece.target >= quantityAllPiecesInWarehouseFix &&
        !pieceData.Piece.target_notified,
    );
    if (
      pieceData.Piece.target >= quantityAllPiecesInWarehouseFix &&
      !pieceData.Piece.target_notified
    ) {
      this.alertsDao.create({
        description: `A Peça ${pieceData.Piece.name} atingiu o seu target.`,
        pieceWarehouseId: pieceData.id,
        warehouseId: request.warehouseOutcomming.id,
      });
      this.pieceDao.updateNotifications(pieceData.Piece.id, {
        target_notified: true,
      });
    }

    if (
      pieceData.Piece.min >= quantityAllPiecesInWarehouseFix &&
      !pieceData.Piece.min_notified
    ) {
      this.alertsDao.create({
        description: `A Peça ${pieceData.Piece.name} atingiu a sua quantidade mínina.`,
        pieceWarehouseId: pieceData.id,
        warehouseId: request.warehouseOutcomming.id,
      });
      this.pieceDao.updateNotifications(pieceData.Piece.id, {
        min_notified: true,
      });
    }
  }

  async getInvoices() {
    return await this.invoiceRecipment.list('');
  }

  async getByStateWarehouseOutcomming(state: string, warehouseId: string) {
    return await this.requestsDao.findByStateWarehouseOutcomming(
      state,
      warehouseId,
    );
  }
  async findByState(state: string, warehouseId: string) {
    return await this.requestsDao.findByState(state, warehouseId);
  }

  async revert(id: string) {
    let request = await this.requestsDao.find(id);

    request.RequestsPieces.forEach(async (requestPiece) => {
      const piece = await this.pieceDao.findPieceWarehouse(
        requestPiece.pieceId,
      );
      this.pieceDao.updateQuantity(
        piece.id,
        requestPiece.quantity + piece.quantity,
      );
    });

    this.requestsDao.changeStateOfRequest(id, 'Rejeitada');
    request = await this.findAll('');

    return request;
  }
}
