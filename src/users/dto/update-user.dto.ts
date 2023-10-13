import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
export class UpdateUserDto extends PartialType(
  CreateUserDto
) {
  id: string;
  name: string;
  position: string;
  password: string;
  email: string;
  company: string;
  created_at: Date;
  updated_at: Date;
}
