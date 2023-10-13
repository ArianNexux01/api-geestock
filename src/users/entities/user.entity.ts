// src/users/entities/user.entity.ts

import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements Users {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  
  
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  name: string;
  
  @ApiProperty()
  position: string;
  
  @ApiProperty()
  email: string;
  
  @ApiProperty()
  address: string;
  
  @ApiProperty()
  role: number[];
  
  @ApiProperty()
  company: string;
  
  @Exclude()
  password: string;
  
  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
}
