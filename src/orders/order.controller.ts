import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { ConfirmOrderDTO } from './dto/confirm-order.dto';

@ApiTags('Order')
@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiCreatedResponse({
    description: 'Order registered successfully',
    type: Order,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(
    @Query('searchParam') searchParam: string,
    @Query('warehouseId') warehouseId: string,
    @Query('state') state: string,
  ) {
    return this.orderService.findAll(searchParam, warehouseId, state);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('curentWarehouse') warehouseId: string,
  ) {
    return this.orderService.findOne(id, warehouseId);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateOrderDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @ApiBearerAuth()
  @Post('/confirm-order/:orderId')
  async confirmOrder(
    @Param('orderId') orderId: string,
    @Body() confirmOrder: ConfirmOrderDTO,
    @Request() req,
  ) {
    console.log(req);
    await this.orderService.confirmOrder(orderId, confirmOrder, req.user);
  }
}
