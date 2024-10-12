import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf, Context, Markup } from 'telegraf';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class TelegramBotService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in the environment');
    }
    this.bot = new Telegraf(token);
  }

  onModuleInit() {
    this.setupBot();
    this.bot
      .launch()
      .then(() => {
        console.log('Telegram bot started');
      })
      .catch((error) => {
        console.error('Failed to start Telegram bot:', error);
      });
  }

  onModuleDestroy() {
    this.bot.stop('SIGINT');
  }

  private setupBot() {
    // Handle /start command
    this.bot.command('start', this.showBannerAndMenu);

    // Handle button clicks
    this.bot.action(['services', 'contact', 'quote'], async (ctx) => {
      await ctx.answerCbQuery();
      const response = this.getResponseForAction(ctx.match[0]);
      await ctx.reply(response);
    });

    console.log('Bot setup completed');
  }

  private showBannerAndMenu = async (ctx: Context) => {
    const bannerText = `
🌟 НОВЕ ЖИТТЯ ВАШИМ МЕБЛЯМ! 🌟
Професійна перетяжка та оновлення
Якісні матеріали • Швидко • Доступно
Звертайтеся до нас для професійної перетяжки та оновлення ваших меблів!
Компанія МЕВАРО: @romaniv21
    `;

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('Наші послуги', 'services')],
      [Markup.button.callback("Зв'язатися з нами", 'contact')],
      [Markup.button.callback('Замовити консультацію', 'quote')],
    ]);

    try {
      // Assuming your image is in the 'assets' folder at the root of your project
      const imagePath = path.join(__dirname, '..', '..', 'assets', 'logo.png');
      const imageBuffer = fs.readFileSync(imagePath);

      await ctx.replyWithPhoto(
        { source: imageBuffer },
        {
          caption: bannerText,
          ...keyboard,
        }
      );
      console.log('Banner with local image and menu sent successfully');
    } catch (error) {
      console.error('Error sending banner with local image and menu:', error);
      // Fallback to text-only message if image send fails
      try {
        await ctx.reply(bannerText, keyboard);
        console.log('Banner sent without image');
      } catch (fallbackError) {
        console.error('Error sending banner without image:', fallbackError);
      }
    }
  };

  private getResponseForAction(action: string): string {
    switch (action) {
      case 'services':
        return 'Our services include furniture assessment, fabric selection, and professional reupholstery.';
      case 'contact':
        return 'Contact us at: contact@mevaro.com or +1234567890';
      case 'quote':
        return "To request a quote, please send us photos of your furniture and we'll get back to you shortly.";
      default:
        return 'Unknown option selected';
    }
  }

  getBot(): Telegraf {
    return this.bot;
  }
}
