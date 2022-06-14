import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { AlchemyService } from 'src/alchemy/alchemy.service';

@Module({
  imports: [AlchemyService],
  providers: [AssetsService],
  controllers: [AssetsController],
})
export class AssetsModule {}
