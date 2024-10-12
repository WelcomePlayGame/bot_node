import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [ConfigModule.forRoot(), TelegramModule],
  providers: [AppService],
})
export class AppModule {}
