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
import { Public } from './public.decorator';
@Controller('api/auth')
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
  @Public()
  async signIn(@Body() signInDto: Record<string, string>) {
    console.log(signInDto);

    try {
      const res = await this.authService.signIn(
        signInDto.email,
        signInDto.password,
      );
      return res;
    } catch (error) {
      console.log(signInDto);
      return { error: error.message, status: 401 };
    }
  }
}
