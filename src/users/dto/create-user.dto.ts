import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  @ApiProperty({
    example: 'Bento Julio',
    description: `The name that will be used in your Profile`,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(15)
  @ApiProperty({
    example: 'Frank, LDA.',
  })
  company: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  @ApiProperty({
    example: 'Fulano@xyz.com.ao',
  })
  email: string;



  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  position: string;
}
