import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class GetAssetsDTO {
  @ApiProperty({
    required: true,
    maxLength: 42,
    minLength: 42,
    description: 'The ETH address of the owner of the assets',
    example: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
  })
  @IsNotEmpty()
  @Length(42, 42)
  address: string;
}
