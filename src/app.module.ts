import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [ConfigModule.forRoot( { isGlobal: true}), AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
