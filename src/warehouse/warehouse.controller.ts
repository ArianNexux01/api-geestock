import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Warehouse } from './entities/warehouse.entity';

@ApiTags('Warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @ApiCreatedResponse({
    description: 'Warehouse registered successfully',
    type: Warehouse,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @Post()
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateWarehouseDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(id);
  }
}
