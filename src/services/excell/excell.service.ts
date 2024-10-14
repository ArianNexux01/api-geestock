import { Injectable } from '@nestjs/common';
import { Suppliers } from '@prisma/client';
import { Workbook } from 'exceljs';
import { SupplierDao } from 'src/supplier/supplier.dao';
import { WarehouseDao } from 'src/warehouse/warehouse.dao';
import { Readable } from 'stream';

@Injectable()
export class ExcellService {
  constructor(
    private supplierDao: SupplierDao,
    private warehouseDao: WarehouseDao,
  ) {}
  async readExcel(file: Express.Multer.File): Promise<any[]> {
    const workbook = new Workbook();
    const buffer = Buffer.from(file.buffer);
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    await workbook.xlsx.read(stream);

    const worksheet = workbook.worksheets[0];
    const data = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Ignorar o cabeçalho, se houver
        const rowData = {};
        row.eachCell((cell, colNumber) => {
          rowData[`column_${colNumber}`] = cell.value;
        });
        data.push(rowData);
      }
    });

    return data;
  }

  async writeToExcel(data: any[], filePath: string) {
    try {
      const workbook = new Workbook();
      data = await Promise.all(
        data
          .filter((piece) => piece.quantity > 0)
          .map(async (piece) => {
            let supplier = await this.supplierDao.find(piece.supplierId);

            let warehouse = await this.warehouseDao.find(piece.warehouseId);

            return {
              brand_name: piece.Piece?.brand_name,
              min: piece.Piece?.min,
              target: piece.Piece?.target,
              supplier: supplier.name,
              warehouse: warehouse?.name,
              totalPrice: Number(piece.price) * Number(piece.quantity),
              quantity: piece.quantity,
              locationInWarehouse: piece.locationInWarehouse,
              ...piece.Piece,
            };
          }),
      );
      const sheet = workbook.addWorksheet('Sheet1');

      const headers = Object({
        name: 'Nome',
        description: 'Descrição',
        partNumber: 'Part Number',
        quantity: 'Quantidade',
        target: 'target',
        price: 'Preço Médio',
        locationInWarehouse: 'Localização',
        min: 'Mínimo',
        brand_name: 'Marca',
        supplier: 'Fornecedor',
        warehouse: 'Armazém',
        totalPrice: 'Preço total',
      });
      sheet.addRow(Object.values(headers));

      // Add data rows
      data.forEach((record) => {
        const row = [];
        Object.keys(headers).forEach((header) => {
          row.push(record[header]);
        });
        sheet.addRow(row);
      });

      // Write to file
      await workbook.xlsx.writeFile(filePath);
    } catch (e) {
      console.log(e);
    }
  }
}
