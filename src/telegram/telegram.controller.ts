import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';

@Controller('telegram')
export class TelegramController {
  constructor(private telegramBotService: TelegramBotService) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() update: any) {
    const bot = this.telegramBotService.getBot();
    await bot.handleUpdate(update);
  }
}
