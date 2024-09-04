import { Prisma, Orders } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class OrderDao {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<any> {
    const ordersPieceData = data.request.map((e) => ({
      pieceId: e.pieceId,
      quantity: e.quantity,
      price: Number(e.price),
    }));

    delete data.request;

    return this.prisma.orders.create({
      data: {
        ...data,
        OrdersPiece: {
          createMany: {
            data: ordersPieceData,
          },
        },
      },
    });
  }

  async list(searchParam: string, state: string): Promise<any[]> {
    if (searchParam !== undefined && searchParam !== '') {
      let argFilterParam: any = [
        {
          imbl_awb: {
            contains: searchParam,
          },
        },
        {
          description: {
            contains: searchParam,
          },
        },

        {
          OrdersPiece: {
            every: {
              Piece: {
                PiecesWarehouse: {
                  every: {
                    Warehouse: {
                      id: searchParam,
                    },
                  },
                },
              },
            },
          },
        },
      ];

      if (state !== null) {
        argFilterParam.push({
          state: state,
        });
      }

      const orders = await this.prisma.orders.findMany({
        where: {
          OR: [...argFilterParam, { requestId: null }],
        },
        include: {
          OrdersPiece: {
            select: {
              orderId: true,
              pieceId: true,
              quantity: true,
              Piece: {
                select: {
                  id: true,
                  name: true,
                  partNumber: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return orders;
    }

    let whereArg: any = {
      requestId: null,
    };

    if (state !== null) {
      whereArg = {
        ...whereArg,
        state: state,
      };
    }
    const orders = await this.prisma.orders.findMany({
      where: whereArg,
      include: {
        OrdersPiece: {
          select: {
            orderId: true,
            pieceId: true,
            quantity: true,
            Piece: {
              select: {
                name: true,
                partNumber: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return orders;
  }

  async listByWarehouseInCommingId(
    warehouseId: string,
    searchParam: string,
    state: string,
  ): Promise<any[]> {
    let orders: any;

    if (searchParam === undefined || searchParam === '') {
      if (warehouseId === undefined) {
        orders = await this.prisma.orders.findMany({
          where: {
            AND: [
              {
                OR: [
                  {
                    imbl_awb: {
                      contains: searchParam,
                    },
                  },
                  {
                    description: {
                      contains: searchParam,
                    },
                  },
                  {
                    state: {
                      equals: searchParam,
                    },
                  },
                ],
              },
            ],
          },
          include: {
            OrdersPiece: {
              select: {
                orderId: true,
                pieceId: true,
                quantity: true,
                Piece: {
                  select: {
                    id: true,
                    name: true,
                    partNumber: true,
                  },
                },
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        });
      } else if (warehouseId === 'Todos') {
        orders = await this.prisma.orders.findMany({
          where: {
            state: state,
          },
          include: {
            OrdersPiece: {
              select: {
                orderId: true,
                pieceId: true,
                quantity: true,
                Piece: {
                  select: {
                    id: true,
                    name: true,
                    partNumber: true,
                  },
                },
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        });
      } else {
        orders = await this.prisma.orders.findMany({
          where: {
            AND: [
              {
                Request: {
                  warehouseIdIncomming: warehouseId,
                },
                state: state,
                OR: [
                  {
                    imbl_awb: {
                      contains: searchParam,
                    },
                  },
                  {
                    description: {
                      contains: searchParam,
                    },
                  },
                  {
                    state: {
                      equals: searchParam,
                    },
                  },
                ],
              },
            ],
          },
          include: {
            OrdersPiece: {
              select: {
                orderId: true,
                pieceId: true,
                quantity: true,
                Piece: {
                  select: {
                    id: true,
                    name: true,
                    partNumber: true,
                  },
                },
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        });
      }
      return orders;
    }

    if (state !== '' || state !== undefined) {
      orders = await this.prisma.orders.findMany({
        where: {
          Request: {
            warehouseIdIncomming: warehouseId,
          },
          state: state,
        },
        include: {
          OrdersPiece: {
            select: {
              orderId: true,
              pieceId: true,
              quantity: true,
              Piece: {
                select: {
                  id: true,
                  name: true,
                  partNumber: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } else {
      orders = await this.prisma.orders.findMany({
        where: {
          Request: {
            warehouseIdIncomming: warehouseId,
          },
        },
        include: {
          OrdersPiece: {
            select: {
              orderId: true,
              pieceId: true,
              quantity: true,
              Piece: {
                select: {
                  id: true,
                  name: true,
                  partNumber: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    }
    return orders;
  }

  async listByWarehouseId(
    warehouseId: string,
    searchParam: string,
  ): Promise<any[]> {
    let orders: any;
    if (searchParam === undefined || searchParam === '') {
      orders = await this.prisma.orders.findMany({
        where: {
          AND: [
            {
              Request: {
                warehouseIdOutcomming: warehouseId,
              },
              OR: [
                {
                  imbl_awb: {
                    contains: searchParam,
                  },
                },
                {
                  description: {
                    contains: searchParam,
                  },
                },
                {
                  state: {
                    equals: searchParam,
                  },
                },
              ],
            },
          ],
        },
        include: {
          OrdersPiece: {
            select: {
              orderId: true,
              pieceId: true,
              quantity: true,
              Piece: {
                select: {
                  id: true,
                  name: true,
                  partNumber: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return orders;
    }
    orders = await this.prisma.orders.findMany({
      where: {
        Request: {
          warehouseIdOutcomming: warehouseId,
        },
      },
      include: {
        OrdersPiece: {
          select: {
            orderId: true,
            pieceId: true,
            quantity: true,
            Piece: {
              select: {
                id: true,
                name: true,
                partNumber: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return orders;
  }

  async findByState(state: string, id: string): Promise<any> {
    return await this.prisma.orders.findMany({
      where: {
        AND: [
          {
            OR: [{ state: state }, { requestId: null }],
            AND: [
              {
                warehouseId: id,
              },
              { state: state },
            ],
          },
        ],
      },
    });
  }

  async findByWarehouseId(
    id: string,
    warehouseId: string,
  ): Promise<any | null> {
    return this.prisma.orders.findFirst({
      where: { id },
      include: {
        OrdersPiece: {
          select: {
            pieceId: true,
            price: true,
            quantity: true,
            quantityGiven: true,
            Piece: {
              select: {
                name: true,
                partNumber: true,
                PiecesWarehouse: {
                  select: {
                    locationInWarehouse: true,
                    Warehouse: {
                      select: {
                        name: true,
                      },
                    },
                  },
                  where: {
                    warehouseId,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: any): Promise<Orders> {
    const ordersPieceData = data.request.map((e) => ({
      pieceId: e.pieceId,
      quantity: e.quantity,
      price: e.price,
    }));

    return this.prisma.orders.update({
      where: {
        id,
      },
      data: {
        description: data.description,
        number_order: data.number_order,
        imbl_awb: data.imbl_awb,
        reference: data.reference,
      },
    });
  }

  async delete(id: string): Promise<Orders> {
    return this.prisma.orders.delete({ where: { id } });
  }

  async changeStateAndPrice(
    orderId: string,
    state: string,
    pieceId?: string,
    quantityGiven?: number,
  ): Promise<any> {
    const user = await this.prisma.ordersPiece.update({
      where: {
        pieceId_orderId: {
          orderId: orderId,
          pieceId: pieceId,
        },
      },
      data: {
        quantityGiven,
        Order: {
          update: {
            state,
          },
        },
      },
    });

    return user;
  }

  async count(warehouseId: string): Promise<any> {
    if (warehouseId !== undefined) {
      const order = this.prisma.orders.count({
        where: {
          OrdersPiece: {
            some: {
              Piece: {
                PiecesWarehouse: {
                  some: {
                    warehouseId,
                  },
                },
              },
            },
          },
        },
      });
      console.log(order);
      return order;
    }
    return this.prisma.orders.count();
  }
}
