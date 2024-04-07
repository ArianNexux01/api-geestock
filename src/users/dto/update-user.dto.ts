import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { Optional } from '@nestjs/common';
export class UpdateUserDto extends PartialType(CreateUserDto) {


  @ApiProperty({
    example: '001',
  })
  userId: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  isActive: boolean

  @IsString()
  @Optional()
  @ApiProperty()
  password: string;


  @Exclude()
  created_at: Date
  @Exclude()
  updated_at: Date
}
