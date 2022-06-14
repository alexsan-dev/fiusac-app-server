import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { AssetsModule } from './assets/assets.module';
import { ConfigModule } from '@nestjs/config';
import { AlchemyModule } from './alchemy/alchemy.module';

@Module({
  imports: [
    AssetsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AlchemyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
