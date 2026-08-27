import { ApiProperty } from '@nestjs/swagger';

export class BaseDTO {
  @ApiProperty({ example: 1, description: 'Entity id' })
  id: number;

  @ApiProperty({ required: false })
  createdBy?: string;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedBy?: string;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ required: false })
  deletedBy?: string;

  @ApiProperty({ required: false })
  deletedAt?: Date;
}
