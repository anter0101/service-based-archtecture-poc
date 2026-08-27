import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { UserDTO } from './user.dto';

export class UpdateUserDTO extends PartialType(UserDTO) {
  @ApiPropertyOptional({ minLength: 8, example: 's3cretPass' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
