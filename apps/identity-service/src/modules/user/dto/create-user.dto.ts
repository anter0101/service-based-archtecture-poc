import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { UserDTO } from './user.dto';

export class CreateUserDTO extends OmitType(UserDTO, [
  'id',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt',
] as const) {
  @ApiProperty({ minLength: 8, example: 's3cretPass' })
  @IsString()
  @MinLength(8)
  password: string;
}
