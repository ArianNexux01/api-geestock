import { Prisma, Pieces, PiecesWarehouse } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LogsActivitiesDao } from 'src/logs-activities/logs-activities.dao';
import { CreatePieceDto } from './dto/create-piece.dto';

type PiecesWarehouseWithPiece = {
  id: string;
  locationInWarehouse: string;
  quantity: number;
  warehouseId: string;
  pieceId: string;
  created_at: Date;
  updated_at: Date;
  Piece: Pieces;
};

type PieceInWarehouse = {
  quantity: number;
  locationInWarehouse: string;
  pieceId: string;
  warehouseId: string;
};

@Injectable()
export class PieceDao {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePieceDto): Promise<any> {
    console.log(data);
    return this.prisma.pieces.create({ data });
  }

  async createPieceInWarehouse(data: PieceInWarehouse): Promise<any> {
    return this.prisma.piecesWarehouse.create({
      data: {
        quantity: data.quantity,
        locationInWarehouse: data.locationInWarehouse,
        pieceId: data.pieceId,
        warehouseId: data.warehouseId,
      },
    });
  }

  async list(searchParam?: string, onlyActive?: number): Promise<any> {
    let pieces: any;
    let where: any;

    if (searchParam !== '' && searchParam !== undefined) {
      where = {
        OR: [
          {
            partNumber: {
              contains: searchParam,
            },
          },
          {
            name: {
              contains: searchParam,
            },
          },
        ],
      };
    }

    if (onlyActive == 1) {
      where = {
        AND: [
          {
            PiecesWarehouse: {
              every: {
                Warehouse: {
                  isActive: true,
                },
              },
            },

            OR: [
              {
                partNumber: {
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
          {
            isActive: true,
          },
        ],
      };
    }

    if (
      (searchParam !== '' && searchParam !== undefined) ||
      onlyActive !== undefined
    ) {
      pieces = await this.prisma.pieces.findMany({
        orderBy: {
          created_at: 'desc',
        },
        where,

        select: {
          brand_name: true,
          id: true,
          description: true,
          partNumber: true,
          name: true,
          price: true,
          state: true,
          supplierId: true,
          target: true,
          min: true,
          isActive: true,
          created_at: true,
          updated_at: true,
          PiecesWarehouse: {
            select: {
              quantity: true,
              locationInWarehouse: true,
              pieceId: true,
              warehouseId: true,
            },
          },
        },
      });

      return pieces;
    }
    return await this.prisma.pieces.findMany({
      orderBy: {
        created_at: 'desc',
      },

      select: {
        brand_name: true,
        id: true,
        description: true,
        partNumber: true,
        name: true,
        price: true,
        state: true,
        target: true,
        min: true,
        supplierId: true,
        isActive: true,
        PiecesWarehouse: {
          select: {
            quantity: true,
            locationInWarehouse: true,
            pieceId: true,
            warehouseId: true,
          },
        },
      },
    });
  }
  async getQuantityOfAllPieces(partNumber: string) {
    return (
      await this.prisma.piecesWarehouse.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          Piece: {
            partNumber: partNumber,
          },
        },
      })
    )._sum.quantity;
  }

  async find(id: string): Promise<Pieces | null> {
    return this.prisma.pieces.findFirst({
      where: { id },
      include: {
        category: true,
        subcategory: true,
        supplier: true,
        PiecesWarehouse: {
          select: {
            quantity: true,
            id: true,
            Warehouse: true,
          },
        },
      },
    });
  }

  async findPieceWarehouse(id: string): Promise<PiecesWarehouseWithPiece> {
    return this.prisma.piecesWarehouse.findFirst({
      where: { id },

      include: {
        Warehouse: true,
        Piece: true,
      },
    });
  }

  async findPieceWarehouseByPieceId(
    id: string,
  ): Promise<PiecesWarehouseWithPiece> {
    return this.prisma.piecesWarehouse.findFirst({
      where: {
        Piece: {
          id: id,
        },
      },

      include: {
        Warehouse: true,
        Piece: true,
      },
      orderBy: {
        Piece: {
          name: 'desc',
        },
      },
    });
  }
  async update(id: string, data: Partial<Pieces>): Promise<Pieces> {
    const piece = this.prisma.pieces.update({ where: { id }, data });
    return piece;
  }

  async updatePieceWarehouse(
    id: string,
    data: Pieces,
  ): Promise<PiecesWarehouseWithPiece> {
    const piece = this.prisma.piecesWarehouse.update({
      where: { id },
      data,
      include: {
        Piece: true,
      },
    });
    return piece;
  }

  async delete(id: string): Promise<Pieces> {
    return this.prisma.pieces.delete({ where: { id } });
  }

  async increaseQuantity(
    id: string,
    warehouseId: string,
    quantity: number,
    locationInWarehouse: string,
  ): Promise<PiecesWarehouse> {
    const piece = this.prisma.piecesWarehouse.update({
      where: {
        pieceId_warehouseId: {
          pieceId: id,
          warehouseId: warehouseId,
        },
      },
      data: {
        quantity: quantity,
        locationInWarehouse: locationInWarehouse,
      },
    });

    return piece;
  }

  async updateQuantity(
    id: string,
    quantity: number,
  ): Promise<PiecesWarehouseWithPiece> {
    console.log('updateQuantity', id);
    const piece = this.prisma.piecesWarehouse.update({
      where: {
        id,
      },
      data: {
        quantity: quantity,
      },
      include: {
        Piece: {
          include: {
            category: true,
            subcategory: true,
            supplier: true,
          },
        },
        Warehouse: true,
      },
    });
    return piece;
  }

  async updatePrice(id: string, newPrice: number): Promise<Pieces> {
    const piece = this.prisma.pieces.update({
      where: { id },
      data: {
        price: newPrice,
      },
    });
    return piece;
  }

  async updateWarehouse(id: string, warehouse: string): Promise<any> {
    const piece = await this.prisma.piecesWarehouse.update({
      where: { id },
      data: {
        warehouseId: warehouse,
      },
    });
    return piece;
  }

  async updateWarehousePieceLocation(
    id: string,
    location: string,
  ): Promise<any> {
    const piece = await this.prisma.piecesWarehouse.update({
      where: { id },
      data: {
        locationInWarehouse: location,
      },
    });
    return piece;
  }

  async findByWarehouseId(
    warehouseId: string,
    searchParam: string,
  ): Promise<any> {
    if (searchParam !== '' && searchParam !== undefined) {
      const piecesByWarehouse = await this.prisma.piecesWarehouse.findMany({
        where: {
          AND: [
            { warehouseId },
            {
              Warehouse: {
                isActive: true,
              },
              Piece: {
                isActive: true,
              },
            },

            {
              OR: [
                {
                  Piece: {
                    partNumber: {
                      contains: searchParam,
                    },
                  },
                },
                {
                  Piece: {
                    name: {
                      contains: searchParam,
                    },
                  },
                },
              ],
            },
          ],
        },
        include: {
          Piece: {
            include: {
              supplier: true,
            },
          },
        },
        orderBy: {
          Piece: {
            name: 'desc',
          },
        },
      });
      return piecesByWarehouse;
    }
    const piecesByWarehouse = await this.prisma.piecesWarehouse.findMany({
      where: {
        AND: [
          { warehouseId },
          {
            Piece: {
              isActive: true,
            },
          },
        ],
      },
      include: {
        Piece: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return piecesByWarehouse;
  }

  async findByPartNumberAndWarehouse(warehouseId: string, partNumber: string) {
    const piecesByWarehousePartNumber =
      await this.prisma.piecesWarehouse.findFirst({
        where: {
          warehouseId,
          Piece: {
            partNumber: partNumber,
          },
        },
      });
    return piecesByWarehousePartNumber;
  }

  async findByWarehouseAndPiece(
    pieceId: string,
    warehouseId: string,
  ): Promise<PiecesWarehouse> {
    return await this.prisma.piecesWarehouse.findFirst({
      where: {
        AND: [
          {
            pieceId: pieceId,
            warehouseId: warehouseId,
          },
        ],
      },
    });
  }
  async count(warehouseId: string): Promise<any> {
    if (warehouseId !== undefined) {
      return (
        await this.prisma.piecesWarehouse.aggregate({
          _sum: {
            quantity: true,
          },
          where: {
            AND: [
              {
                Piece: {
                  isActive: true,
                },
                warehouseId: warehouseId,
                Warehouse: {
                  isActive: true,
                },
              },
            ],
          },
        })
      )._sum.quantity;
    }
    return (
      await this.prisma.piecesWarehouse.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          Piece: {
            isActive: true,
          },
        },
      })
    )._sum.quantity;
  }

  async changeStatus(id: string, status: number): Promise<any> {
    const returnData = await this.prisma.pieces.update({
      where: { id: id },
      data: {
        isActive: status == 1,
      },
    });

    return returnData;
  }
}
