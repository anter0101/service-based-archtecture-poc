import { BaseDTO } from '@app/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserDTO } from './dto/user.dto';
import { User } from './user.entity';

const allowedUserDtoKeys: ReadonlyArray<keyof UserDTO | keyof BaseDTO> = [
  'id',
  'name',
  'email',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
  'deletedAt',
  'deletedBy',
] as const;

export function mapUserToDtoSelective(
  user: User,
  keys?: (keyof UserDTO | keyof BaseDTO)[],
): Partial<UserDTO>;
export function mapUserToDtoSelective(
  users: User[],
  keys?: (keyof UserDTO | keyof BaseDTO)[],
): Partial<UserDTO>[];
export function mapUserToDtoSelective(
  userOrUsers: User | User[],
  keys?: (keyof UserDTO | keyof BaseDTO)[],
): Partial<UserDTO> | Partial<UserDTO>[] {
  const mapSingle = (user: User): Partial<UserDTO> => {
    const dto: Partial<UserDTO> = {};
    const keysToMap = (keys || allowedUserDtoKeys).filter((key) =>
      allowedUserDtoKeys.includes(key),
    );

    keysToMap.forEach((key) => {
      if (key in user && user[key as keyof User] !== undefined) {
        Object.assign(dto, { [key]: user[key as keyof User] });
      }
    });

    return dto;
  };

  return Array.isArray(userOrUsers)
    ? userOrUsers.map(mapSingle)
    : mapSingle(userOrUsers);
}

export const mapCreateUserDtoToEntity = (dto: CreateUserDTO): User => {
  const user = new User();
  user.name = dto.name;
  user.email = dto.email;
  user.password = dto.password;
  return user;
};

export const mapUpdateUserDtoToEntity = (dto: UpdateUserDTO): User => {
  const user = new User();
  if (dto.id !== undefined) user.id = dto.id;
  if (dto.name !== undefined) user.name = dto.name;
  if (dto.email !== undefined) user.email = dto.email;
  if (dto.password !== undefined) user.password = dto.password;
  return user;
};
