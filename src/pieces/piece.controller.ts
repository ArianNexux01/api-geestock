import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PieceService } from './piece.service';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';
import fs from 'fs/promises';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Piece } from './entities/piece.entity';
import { UpdateLocationPieceDto } from './dto/update-location-piece.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcellService } from 'src/services/excell/excell.service';
import { CategoryDao } from 'src/category/category.dao';
import { SubcategoryDao } from 'src/subcategory/subcategory.dao';
import { SupplierDao } from 'src/supplier/supplier.dao';
import { join } from 'path';
import { WarehouseDao } from 'src/warehouse/warehouse.dao';

@ApiTags('Piece')
@Controller('api/piece')
export class PieceController {
  constructor(
    private readonly pieceService: PieceService,
    private readonly excellService: ExcellService,
    private readonly categoryDao: CategoryDao,
    private readonly subcategoryDao: SubcategoryDao,
    private readonly warehouseDao: WarehouseDao,
    private readonly supplierDao: SupplierDao,
  ) {}

  @ApiCreatedResponse({
    description: 'Piece registered successfully',
    type: Piece,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @Post()
  create(@Body() createPieceDto: CreatePieceDto) {
    return this.pieceService.create(createPieceDto);
  }

  @ApiQuery({
    name: 'searchParam',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'onlyActive',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'onlyWithQuantity',
    type: Number,
    required: false,
  })
  @Get()
  findAll(
    @Query('searchParam') searchParam?: string,
    @Query('onlyActive') onlyActive?: number,
    @Query('onlyWithQuantity') onlyWithQuantity?: number,
  ) {
    return this.pieceService.findAll(searchParam, onlyActive, onlyWithQuantity);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pieceService.findOne(id);
  }

  @Get('/warehouse/:id')
  findByWarehouse(
    @Param('id') id: string,
    @Query('searchParam') searchParam?: string,
  ) {
    return this.pieceService.findByWarehouse(id, searchParam);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdatePieceDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePieceDto: UpdatePieceDto) {
    return this.pieceService.update(id, updatePieceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pieceService.remove(id);
  }

  @Get('change-status/:id')
  changeStatus(@Param('id') id: string, @Query('status') status: number) {
    return this.pieceService.changeStatus(id, status);
  }

  @Put('update-location/:id')
  @ApiBody({ type: UpdateLocationPieceDto })
  changeLocation(
    @Param('id') id: string,
    @Body() updateLocation: UpdateLocationPieceDto,
  ) {
    return this.pieceService.updateWarehousePieceLocation(
      id,
      updateLocation.location,
    );
  }

  @Post('insert-excell')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async saveByExcell(@UploadedFile() file: Express.Multer.File) {
    try {
      const dataFromExcell = await this.excellService.readExcel(file);
      const dataToInsertInDb = await Promise.all(
        dataFromExcell.map(async (data: any) => {
          const category = await this.categoryDao.findByName(data.column_5);
          const subcategory = await this.subcategoryDao.findByName(
            data.column_6,
          );
          const supplier = await this.supplierDao.findByName(data.column_9);

          return {
            name: data.column_1,
            description: data.column_2,
            partNumber: data.column_3,
            price: 0,
            categoryId: category.id,
            subCategoryId: subcategory.id,
            supplierId: supplier.id,
            target: data.column_4,
            min: data.column_7,
            userId: '1',
            state: 'Disponivel',
          };
        }),
      );

      dataToInsertInDb.forEach(async (data: any) => {
        this.pieceService.create(data);
      });

      return dataToInsertInDb;
    } catch (e) {
      return null;
    }
  }

  @Get('download-excel/:id')
  async writeExcel(@Param('id') id: string) {
    let warehouse = await this.warehouseDao.find(id);

    /*  let nameFile =
      warehouse.name + new Date().toLocaleString() + 'piece-data.xlsx';
    await fs.writeFile(nameFile,)*/
    let nameFile = 'piece-data.xlsx';
    try {
      const filePath = join('public', nameFile);
      let data = [];

      if (id === 'Todos') {
        const warehouses = await this.warehouseDao.list('', 1);

        for (let index = 0; index < warehouses.length; index++) {
          data.push(
            ...(await this.pieceService.findByWarehouse(
              warehouses[index].id,
              '',
            )),
          );
        }
      } else {
        data = await this.pieceService.findByWarehouse(id, '');
      }
      await this.excellService.writeToExcel(data, filePath);

      return {
        message: 'Excel file written successfully',
        output: process.env.FILES_URL + '/' + nameFile,
      };
    } catch (error) {
      console.log(error);
      return new Error(`Error writing Excel file: ${error.message}`);
    }
  }
}
