import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';

// ARCHIVOS ESTÁTICOS
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
