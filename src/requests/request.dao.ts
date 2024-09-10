import { Prisma, Pieces, Requests } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { equals } from 'class-validator';

@Injectable()
export class RequestDao {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<any> {
    const requestPiecesData = data.request.map((e) => ({
      pieceWarehouseId: e.pieceId,
      quantity: e.quantityRequested,
    }));
    return this.prisma.requests.create({
      data: {
        state: data.state,
        name: data.name,
        numberPr: data.numberPr,
        RequestsPieces: {
          createMany: {
            data: requestPiecesData,
          },
        },
        warehouseIncomming: {
          connect: {
            id: data.warehouseIdIncomming,
          },
        },
        warehouseOutcomming: {
          connect: {
            id: data.warehouseIdOutcomming,
          },
        },
      },
    });
  }

  async list(searchParam: string): Promise<any[]> {
    if (searchParam !== '' && searchParam !== undefined) {
      const request = await this.prisma.requests.findMany({
        where: {
          OR: [
            {
              numberPr: {
                contains: searchParam,
              },
            },
            {
              name: {
                contains: searchParam,
              },
            },
          ],
        },
        include: {
          warehouseIncomming: {
            select: {
              id: true,
              name: true,
            },
          },
          warehouseOutcomming: {
            select: {
              id: true,
              name: true,
            },
          },
          RequestsPieces: {
            select: {
              pieceWarehouseId: true,
              quantity: true,
              PiecesWarehouse: {
                select: {
                  Piece: {
                    select: {
                      name: true,
                      price: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return request;
    }
    const request = await this.prisma.requests.findMany({
      include: {
        warehouseIncomming: {
          select: {
            name: true,
          },
        },
        warehouseOutcomming: {
          select: {
            id: true,
            name: true,
          },
        },
        RequestsPieces: {
          select: {
            pieceWarehouseId: true,
            quantity: true,

            PiecesWarehouse: {
              select: {
                Piece: {
                  select: {
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return request;
  }

  async find(id: string): Promise<any> {
    return this.prisma.requests.findFirst({
      where: { id },
      include: {
        warehouseIncomming: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        warehouseOutcomming: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        RequestsPieces: {
          select: {
            id: true,
            pieceWarehouseId: true,
            quantity: true,
            quantityGiven: true,
            request: {
              select: {
                numberPr: true,
              },
            },
            PiecesWarehouse: {
              select: {
                id: true,
                locationInWarehouse: true,
                Piece: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    partNumber: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: any): Promise<any> {
    const piecesData = data.request.map((e) => ({
      pieceId: e.pieceId,
      quantity: e.quantity,
    }));

    const insertedData = {
      name: data.name,
      numberPr: data.numberPr,
    };
    return this.prisma.requests.update({
      where: { id },
      data: {
        ...insertedData,
        RequestsPieces: {
          createMany: {
            data: piecesData,
          },
        },
        warehouseIncomming: {
          connect: {
            id: data.warehouseIdIncomming,
          },
        },
        warehouseOutcomming: {
          connect: {
            id: data.warehouseIdOutcomming,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<any> {
    return this.prisma.requests.delete({ where: { id } });
  }
  async findByStateWarehouseOutcomming(
    state: string,
    warehouseOutcommingId: string,
  ) {
    let request;
    const query = {
      include: {
        RequestsPieces: {
          select: {
            PiecesWarehouse: {
              select: {
                id: true,
                Piece: {
                  select: {
                    name: true,
                    partNumber: true,
                    description: true,
                    price: true,
                  },
                },
              },
            },
            quantity: true,
            request: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        warehouseIncomming: {
          select: {
            id: true,
            name: true,
          },
        },
        warehouseOutcomming: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    };
    if (warehouseOutcommingId === 'Todos') {
      request = await this.prisma.requests.findMany({
        where: {
          state,
        },
        ...query,
      });
    } else {
      request = await this.prisma.requests.findMany({
        where: {
          state,
          warehouseIdOutcomming: warehouseOutcommingId,
        },
        ...query,
      });
    }

    return request;
  }
  async findByIncommingWarehouse(
    id: string,
    searchParam: string,
  ): Promise<any> {
    const request = await this.prisma.requests.findMany({
      where: {
        AND: [
          {
            warehouseIdIncomming: id,
            OR: [
              {
                numberPr: {
                  contains: searchParam,
                },
              },
              {
                name: {
                  contains: searchParam,
                },
              },
            ],
          },
        ],
      },
      include: {
        RequestsPieces: {
          select: {
            PiecesWarehouse: {
              select: {
                id: true,
                locationInWarehouse: true,
                quantity: true,
                Piece: {
                  select: {
                    name: true,
                    partNumber: true,
                    description: true,
                    price: true,
                  },
                },
              },
            },
            quantity: true,
            request: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        warehouseIncomming: {
          select: {
            id: true,
            name: true,
          },
        },
        warehouseOutcomming: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return request;
  }

  async findByOutcommingWarehouse(
    id: string,
    searchParam: string,
  ): Promise<any> {
    const request = await this.prisma.requests.findMany({
      where: {
        AND: [
          {
            warehouseIdOutcomming: id,
            OR: [
              {
                numberPr: {
                  contains: searchParam,
                },
              },
              {
                name: {
                  contains: searchParam,
                },
              },
            ],
          },
        ],
      },
      include: {
        RequestsPieces: {
          select: {
            PiecesWarehouse: {
              select: {
                id: true,
                Piece: {
                  select: {
                    name: true,
                    partNumber: true,
                    description: true,
                    price: true,
                  },
                },
              },
            },
            quantity: true,
            request: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        warehouseIncomming: {
          select: {
            id: true,
            name: true,
          },
        },
        warehouseOutcomming: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return request;
  }

  async changeStateOfRequest(id: string, state: string): Promise<any> {
    const request = this.prisma.requests.update({
      where: { id },
      data: {
        state,
      },
    });
    return request;
  }

  async updateQuantityGivenInRequestPieces(id: string, quantityGiven: number) {
    const request = this.prisma.requestsPieces.update({
      where: {
        id,
      },
      data: { quantityGiven: Number(quantityGiven) },
    });

    return request;
  }

  async findByRequestAndPieceId(requestId: string, pieceWarehouseId: string) {
    return this.prisma.requestsPieces.findFirst({
      where: {
        requestId,
        pieceWarehouseId,
      },
    });
  }

  async count(warehouseId: string): Promise<any> {
    if (warehouseId !== undefined) {
      const data = await this.prisma.requests.count({
        where: {
          AND: [
            {
              OR: [
                {
                  warehouseIdIncomming: warehouseId,
                },
              ],
            },
          ],
        },
      });
      return data;
    }
    return this.prisma.requests.count({
      where: {
        state: 'Finalizada',
      },
    });
  }

  async findByState(state: string, warehouseId: string): Promise<any> {
    let where: any = {
      state: state,
      isActive: true,
    };

    if (warehouseId !== '' && warehouseId !== undefined) {
      where = {
        state: state,
        isActive: true,
        warehouseIdOutcomming: warehouseId,
      };
    }
    const request = await this.prisma.requests.findMany({
      where: {
        ...where,
      },
      include: {
        warehouseIncomming: {
          select: {
            name: true,
          },
        },
        warehouseOutcomming: {
          select: {
            name: true,
          },
        },
        RequestsPieces: {
          select: {
            pieceWarehouseId: true,
            quantity: true,

            PiecesWarehouse: {
              select: {
                Piece: {
                  select: {
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return request;
  }
}
