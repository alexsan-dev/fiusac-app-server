import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { GetNftsResponse } from '@alch/alchemy-web3';
import { AssetsService } from './assets.service';
import { GetAssetsDTO } from './dto/assets.dto';
import { Response } from 'express';

@Controller('assets')
export class AssetsController {
  constructor(private service: AssetsService) {}

  @Get('/')
  async getAllAssets(@Query() queryBody: GetAssetsDTO, @Res() res: Response) {
    try {
      const list: GetNftsResponse = await this.service.getAllAssets(queryBody);
      res.status(HttpStatus.OK).json(list);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  }
}
