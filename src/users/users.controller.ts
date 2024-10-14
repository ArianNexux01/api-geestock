import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  Res,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { UserEntity } from './entities/user.entity';
@Controller('api/users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: UserEntity,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    try {
      const data = await this.usersService.create(createUserDto);
      response.status(200).json({
        message: 'User inserted successfully',
        data,
      });
    } catch (err) {
      console.log(err);
      response.status(400).json(err);
    }
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
  @Get()
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
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Successfully retrieved users',
    type: [UserEntity],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findAll(
    @Query('searchParam') searchParam: string,
    @Query('onlyActive') onlyActive: number,
  ) {
    const users = await this.usersService.findAll(searchParam, onlyActive);
    return users;
  }
  @Get('/roles')
  async getRoles() {
    return this.usersService.listRoles();
  }
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('change-status/:id')
  changeStatus(@Param('id') id: string, @Query('status') status: number) {
    return this.usersService.changeStatus(id, status);
  }

  @Put('reset-password/:id')
  resetPassword(@Param('id') id: string) {
    return this.usersService.resetPassword(id);
  }
}
