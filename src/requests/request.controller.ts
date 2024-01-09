import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDTO } from './dto/create-request.dto';
import { UpdateRequestDTO } from './dto/update-request.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Request } from './entities/request.entity';
import { AcceptRequestDTO } from './dto/accept-request.dto';

@ApiTags('Request')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) { }

  @ApiCreatedResponse({
    description: 'Request registered successfully',
    type: Request,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @Post()
  create(@Body() createRequestDto: CreateRequestDTO) {
    return this.requestService.create(createRequestDto);
  }

  @Get()
  findAll() {
    return this.requestService.findAll();
  }

  @Get('/invoices')
  async findInvoice() {
    return this.requestService.getInvoices();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateRequestDTO })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDTO) {
    return this.requestService.update(id, updateRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(id);
  }

  @Get('/warehouseincomming/:id')
  async getWarehouseIncomming(@Param('id') id: string) {
    return await this.requestService.findByWarehouseIncommingId(id);
  }

  @Get('/warehouseoutcomming/:id')
  async getWarehouseOutcomming(@Param('id') id: string) {
    return await this.requestService.findByWarehouseOutcommingId(id);
  }


  @Post('/accept-request/:id')
  @ApiBody({ type: AcceptRequestDTO })
  async acceptRequest(@Param('id') id: string, @Body() request: AcceptRequestDTO) {
    return await this.requestService.acceptRequest(id, request);
  }
}
