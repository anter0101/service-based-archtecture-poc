import { User } from './user.entity';
import { mapUserToDtoSelective } from './user.mapper';

describe('mapUserToDtoSelective', () => {
  it('never includes passwordHash', () => {
    const user = {
      id: 1,
      name: 'Ada',
      email: 'ada@example.com',
      passwordHash: 'hashed',
    } as User;

    const dto = mapUserToDtoSelective(user);

    expect(dto).toEqual({
      id: 1,
      name: 'Ada',
      email: 'ada@example.com',
    });
    expect(dto).not.toHaveProperty('passwordHash');
    expect(dto).not.toHaveProperty('password');
  });
});
