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
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDTO } from './dto/create-request.dto';
import { UpdateRequestDTO } from './dto/update-request.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from './entities/request.entity';
import { AcceptRequestDTO } from './dto/accept-request.dto';

@ApiTags('Request')
@Controller('api/request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

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
  findAll(@Query('searchParam') searchParam: string) {
    return this.requestService.findAll(searchParam);
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
  async getWarehouseIncomming(
    @Param('id') id: string,
    @Query('searchParam') searchParam: string,
  ) {
    return await this.requestService.findByWarehouseIncommingId(
      id,
      searchParam,
    );
  }

  @Get('/warehouseoutcomming/:id')
  async getWarehouseOutcomming(
    @Param('id') id: string,
    @Query('searchParam') searchParam: string,
  ) {
    return await this.requestService.findByWarehouseOutcommingId(
      id,
      searchParam,
    );
  }

  @Get('/by-state/:state')
  async getByState(
    @Param('state') state: string,
    @Query('warehouseId') warehouseId: string,
  ) {
    return await this.requestService.findByState(state, warehouseId);
  }

  @Get('/by-state/warehouseoutcomming/:state/:warehouseId')
  async getByStateWarehouseOutcomming(
    @Param('state') state: string,
    @Param('warehouseId') warehouseId: string,
  ) {
    return await this.requestService.getByStateWarehouseOutcomming(
      state,
      warehouseId,
    );
  }

  @Post('/accept-request/:id')
  @ApiBody({ type: AcceptRequestDTO })
  async acceptRequest(
    @Param('id') id: string,
    @Body() request: AcceptRequestDTO,
  ) {
    return await this.requestService.acceptRequest(id, request);
  }

  @Put('/revert-request/:id')
  async revert(@Param('id') id: string) {
    return await this.requestService.revert(id);
  }
}
