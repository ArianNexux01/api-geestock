import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @ApiProperty({
    example: 'Frank',
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: '001',
  })
  userId: string;

  @IsString()
  @ApiProperty({
    example: 'Armazem de vendas',
  })
  categoryId: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '0001',
  })
  code: string;
}
