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
export class UpdateUserDto extends CreateUserDto {


  @ApiProperty({
    example: '001',
  })
  userId: string

  @Exclude()
  created_at: Date
  @Exclude()
  updated_at: Date
}
