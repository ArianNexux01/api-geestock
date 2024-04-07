import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Supplier } from './entities/supplier.entity';

@ApiTags('Supplier')
@Controller('api/supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) { }

  @ApiCreatedResponse({
    description: 'Supplier registered successfully',
    type: Supplier,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @ApiQuery({
    name: "searchParam",
    type: String,
    required: false
  })
  @ApiQuery({
    name: "onlyActive",
    type: Number,
    required: false
  })
  @Get()
  findAll(@Query('searchParam') searchParam: string, @Query('onlyActive') onlyActive: number) {
    return this.supplierService.findAll(searchParam, onlyActive);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateSupplierDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }

  @Get('change-status/:id')
  changeStatus(@Param('id') id: string, @Query('status') status: number) {
    return this.supplierService.changeStatus(id, status);
  }
}
