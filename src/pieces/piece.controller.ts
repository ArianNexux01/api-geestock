import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PieceService } from './piece.service';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Piece } from './entities/piece.entity';

@ApiTags('Piece')
@Controller('api/piece')
export class PieceController {
  constructor(private readonly pieceService: PieceService) { }

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
    name: "searchParam",
    type: String,
    required: false
  })
  @ApiQuery({
    name: "onlyActive",
    type: Number,
    required: false
  })

  @ApiQuery({
    name: "onlyWithQuantity",
    type: Number,
    required: false
  })
  @Get()
  findAll(@Query('searchParam') searchParam?: string, @Query('onlyActive') onlyActive?: number, @Query('onlyWithQuantity') onlyWithQuantity?: number) {
    return this.pieceService.findAll(searchParam, onlyActive, onlyWithQuantity);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pieceService.findOne(id);
  }

  @Get('/warehouse/:id')
  findByWarehouse(@Param('id') id: string, @Query('searchParam') searchParam?: string) {
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
}
