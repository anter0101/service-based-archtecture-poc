import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const repository = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: repository },
      ],
    }).compile();

    service = module.get(UserService);
    jest.clearAllMocks();
  });

  it('finds a user by id', async () => {
    const user = { id: 1, name: 'Ada', email: 'ada@example.com' } as User;
    repository.findOne.mockResolvedValue(user);

    await expect(service.findById(1)).resolves.toEqual(user);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('returns undefined when the user does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findById(99)).resolves.toBeUndefined();
  });
});
