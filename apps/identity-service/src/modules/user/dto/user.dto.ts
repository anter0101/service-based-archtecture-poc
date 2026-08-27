import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { BaseDTO } from '@app/common';

export class UserDTO extends BaseDTO {
  @ApiProperty({ example: 'Ada Lovelace' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({ uniqueItems: true, example: 'ada@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
