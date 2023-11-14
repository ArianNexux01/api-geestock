import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PieceService } from './piece.service';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Piece } from './entities/piece.entity';

@ApiTags('Piece')
@Controller('piece')
export class PieceController {
  constructor(private readonly warehouseService: PieceService) { }

  @ApiCreatedResponse({
    description: 'Piece registered successfully',
    type: Piece,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @Post()
  create(@Body() createPieceDto: CreatePieceDto) {
    return this.warehouseService.create(createPieceDto);
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
  @ApiBody({ type: UpdatePieceDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePieceDto: UpdatePieceDto) {
    return this.warehouseService.update(id, updatePieceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(id);
  }
}
