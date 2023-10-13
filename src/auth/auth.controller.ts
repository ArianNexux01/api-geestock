import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { loginDto } from './auth.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({
    type: loginDto,
  })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: UserEntity,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  
  signIn(@Body() signInDto: Record<string, string>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
