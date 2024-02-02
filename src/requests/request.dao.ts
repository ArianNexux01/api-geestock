import { Prisma, Pieces, Requests } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class RequestDao {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any): Promise<any> {
        console.log(data);
        const piecesData = data.request.map(e => ({
            pieceId: e.pieceId,
            quantity: e.quantity
        }))
        return this.prisma.requests.create({
            data: {
                state: data.state,
                name: data.name,

                RequestsPieces: {
                    createMany: {
                        data: piecesData
                    }

                },
                warehouseIncomming: {
                    connect: {
                        id: data.warehouseIdIncomming
                    }
                },
                warehouseOutcomming: {
                    connect: {
                        id: data.warehouseIdOutcomming
                    }
                },
            },


        });
    }

    async list(): Promise<any[]> {
        const request = await this.prisma.requests.findMany({
            include: {
                warehouseIncomming: {
                    select: {
                        name: true
                    }
                },
                RequestsPieces: {
                    select: {
                        pieceId: true,
                        quantity: true,

                        piece: {
                            select: {
                                name: true,
                                price: true
                            }
                        }
                    }
                }

            }
        });

        return request;
    }

    async find(id: string): Promise<any> {
        return this.prisma.requests.findFirst({
            where: { id },
            include: {
                warehouseIncomming: {
                    select: {
                        name: true
                    }
                },
                warehouseOutcomming: {
                    select: {
                        name: true
                    }
                },
                RequestsPieces: {
                    select: {
                        id: true,
                        pieceId: true,
                        quantity: true,
                        piece: {
                            select: {
                                name: true,
                                price: true
                            }
                        }
                    }
                }

            }
        });
    }

    async update(id: string, data: any): Promise<any> {
        const piecesData = data.request.map(e => ({
            pieceId: e.pieceId,
            quantity: e.quantity
        }))
        return this.prisma.requests.update({
            where: { id },
            data: {
                state: data.state,
                name: data.name,

                RequestsPieces: {
                    createMany: {
                        data: piecesData
                    }

                },
                warehouseIncomming: {
                    connect: {
                        id: data.warehouseIdIncomming
                    }
                },
                warehouseOutcomming: {
                    connect: {
                        id: data.warehouseIdOutcomming
                    }
                },
            },


        });
    }

    async delete(id: string): Promise<any> {
        return this.prisma.requests.delete({ where: { id } });
    }

    async findByIncommingWarehouse(id: string): Promise<any> {
        const request = await this.prisma.requests.findMany({
            where: {
                warehouseIdIncomming: id
            },
            include: {
                RequestsPieces: {
                    select: {
                        piece: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        quantity: true,
                        request: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                warehouseIncomming: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                warehouseOutcomming: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return request;
    }
    async findByOutcommingWarehouse(id: string): Promise<any> {
        const request = await this.prisma.requests.findMany({
            where: {
                warehouseIdOutcomming: id
            },
            include: {
                RequestsPieces: {
                    select: {
                        piece: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        quantity: true,
                        request: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                warehouseIncomming: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                warehouseOutcomming: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return request;
    }

    async changeStateOfRequest(id: string, state: string): Promise<any> {
        const request = this.prisma.requests.update({
            where: { id },
            data: {
                state
            }
        });
        return request
    }

    async updateQuantityGivenInRequestPieces(id: string, quantityGiven: number) {
        const request = this.prisma.requestsPieces.update({
            where: { id },
            data: { quantityGiven }
        })

        return request
    }

    async findByRequestAndPieceId(requestId: string, pieceId: string) {
        return this.prisma.requestsPieces.findFirst({
            where: {
                requestId,
                pieceId
            }
        })
    }
}
