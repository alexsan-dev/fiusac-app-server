import { Injectable } from '@nestjs/common';
import {
  AlchemyWeb3,
  createAlchemyWeb3,
  GetNftsResponse,
} from '@alch/alchemy-web3';
import { ConfigService } from '@nestjs/config';
import { GetAssetsDTO } from 'src/assets/dto/assets.dto';

@Injectable()
export class AlchemyService {
  public nftWeb3: AlchemyWeb3 | null = null;
  constructor(private configService: ConfigService) {}

  /**
   * It creates a new instance of AlchemyWeb3 if it doesn't exist.
   * @returns The web3 instance for the NFT contract
   */
  getNFTWeb3() {
    const isDev: boolean = this.configService.get('DEV');
    this.nftWeb3 ??= createAlchemyWeb3(
      `https://eth-${
        isDev ? 'rinkeby' : 'mainet'
      }.alchemyapi.io/nft/v2/${this.configService.get(
        `ALCHEMY_API_KEY_${isDev ? 'DEV' : 'PROD'}`,
      )}`,
    );
    return this.nftWeb3;
  }

  /**
   * It gets all the NFTs owned by a specific address, and filters out any NFTs that don't have a title
   * @param owner - The address of the user you want to get NFTs for.
   * @returns An array of NFTs
   */
  async getNFTs(owner: GetAssetsDTO['address']): Promise<GetNftsResponse> {
    const nfts = await this.getNFTWeb3().alchemy.getNfts({
      contractAddresses: [this.configService.get('OPENSEA_COLLECTION_ADDRESS')],
      owner,
    });
    nfts.ownedNfts = nfts.ownedNfts.filter((nft) => nft.title.length > 0);
    return nfts;
  }
}
