import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HeaderUtil, PageRequest } from '@app/common';
import type { Request } from '@app/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserDTO } from './dto/user.dto';
import { UserQueryDTO } from './dto/user-query.dto';
import { UserService } from './user.service';
import {
  mapCreateUserDtoToEntity,
  mapUpdateUserDtoToEntity,
  mapUserToDtoSelective,
} from './user.mapper';

@Controller('api/users')
@ApiTags('users-module')
@ApiExtraModels(UserDTO, CreateUserDTO, UpdateUserDTO, UserQueryDTO)
export class UserController {
  logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get the list of users paginated' })
  @ApiResponse({
    status: 200,
    description: 'List all users',
    type: UserDTO,
    isArray: true,
  })
  async getAll(
    @Req() req: Request,
    @Query() query: UserQueryDTO,
  ): Promise<Partial<UserDTO>[]> {
    const pageRequest = new PageRequest(
      +(query.page ?? 1),
      +(query.pageSize ?? 10),
      query.sortField ? `${query.sortField},${query.sortOrder || 'ASC'}` : '',
    );

    const [results, count] = await this.userService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });

    HeaderUtil.addPaginationHeaders(
      req.res!,
      count,
      pageRequest.page,
      count > pageRequest.page * pageRequest.size,
    );

    return mapUserToDtoSelective(results);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'User found', type: UserDTO })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getById(@Param('id') id: number): Promise<Partial<UserDTO>> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return mapUserToDtoSelective(user);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({ status: 201, description: 'User created', type: UserDTO })
  async create(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<Partial<UserDTO>> {
    const mapped = mapCreateUserDtoToEntity(createUserDTO);
    const saved = await this.userService.save(mapped);
    return mapUserToDtoSelective(saved);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateUserDTO })
  @ApiResponse({ status: 200, description: 'User updated', type: UserDTO })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: number,
    @Body() userDTO: UpdateUserDTO,
  ): Promise<Partial<UserDTO>> {
    const existing = await this.userService.findById(id);
    if (!existing) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const mapped = mapUpdateUserDtoToEntity(userDTO);
    mapped.id = id;
    const updated = await this.userService.update(mapped);
    return mapUserToDtoSelective(updated);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: number): Promise<void> {
    const existing = await this.userService.findById(id);
    if (!existing) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userService.delete(existing);
  }
}
