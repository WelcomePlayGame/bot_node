import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [ConfigModule],
  providers: [TelegramBotService],
  controllers: [TelegramController],
  exports: [TelegramBotService],
})
export class TelegramModule {}
