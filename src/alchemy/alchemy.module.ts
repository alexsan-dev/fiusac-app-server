import { Global, Module } from '@nestjs/common';
import { AlchemyService } from './alchemy.service';

@Global()
@Module({
  providers: [AlchemyService],
  exports: [AlchemyService],
})
export class AlchemyModule {}
