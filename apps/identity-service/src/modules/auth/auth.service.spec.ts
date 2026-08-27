import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';

describe('AuthService', () => {
  let service: AuthService;
  const userService = {
    findByFields: jest.fn(),
    findByEmailWithPassword: jest.fn(),
    save: jest.fn(),
  };
  const jwtService = {
    sign: jest.fn().mockReturnValue('signed-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
    jwtService.sign.mockReturnValue('signed-token');
  });

  it('registers a user and returns a JWT without a password hash', async () => {
    userService.findByFields.mockResolvedValue(undefined);
    userService.save.mockImplementation((user: User) => {
      user.id = 1;
      return Promise.resolve(user);
    });

    const result = await service.register({
      name: 'Ada',
      email: 'ada@example.com',
      password: 's3cretPass',
    });

    expect(result.accessToken).toBe('signed-token');
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: '1',
      email: 'ada@example.com',
    });
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(JSON.stringify(result)).not.toContain('s3cretPass');
  });

  it('rejects duplicate emails', async () => {
    userService.findByFields.mockResolvedValue({ id: 1 });

    await expect(
      service.register({
        name: 'Ada',
        email: 'ada@example.com',
        password: 's3cretPass',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in with a valid password', async () => {
    const passwordHash = await hash('s3cretPass', 4);
    userService.findByEmailWithPassword.mockResolvedValue({
      id: 1,
      name: 'Ada',
      email: 'ada@example.com',
      passwordHash,
    });

    const result = await service.login({
      email: 'ada@example.com',
      password: 's3cretPass',
    });

    expect(result.accessToken).toBe('signed-token');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects invalid credentials', async () => {
    userService.findByEmailWithPassword.mockResolvedValue(undefined);

    await expect(
      service.login({ email: 'ada@example.com', password: 'nope' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
