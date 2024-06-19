import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, LoginUserDto } from './dto/auth.dto';
import { Public } from './public-strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }
 
  @Public()
  @Post('login')
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }
}
