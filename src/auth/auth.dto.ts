import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class loginDto {
  @ApiProperty({
    example: 'FulanoArroz@xyz.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'qsw242t4@%$GRe',
  })
  @IsString()
  password: string;
}
