import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiTags('Category')
@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @ApiCreatedResponse({
    description: 'Category registered successfully',
    type: Category,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
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
    return this.categoryService.findAll(searchParam, onlyActive);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateCategoryDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Get('change-status/:id')
  changeStatus(@Param('id') id: string, @Query('status') status: number) {
    return this.categoryService.changeStatus(id, status);
  }
}
