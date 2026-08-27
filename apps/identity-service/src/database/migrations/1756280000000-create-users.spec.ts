import { Table } from 'typeorm';
import { CreateUsers1756280000000 } from './1756280000000-create-users';

describe('CreateUsers migration', () => {
  it('creates the identity schema and users table', async () => {
    const queryRunner = {
      createSchema: jest.fn(),
      createTable: jest.fn(),
    };
    const migration = new CreateUsers1756280000000();

    await migration.up(queryRunner as never);

    expect(queryRunner.createSchema).toHaveBeenCalledWith('identity', true);
    expect(queryRunner.createTable).toHaveBeenCalledTimes(1);
    const [table] = queryRunner.createTable.mock.calls[0] as [Table];
    expect(table.schema).toBe('identity');
    expect(table.name).toBe('users');
    expect(table.columns.map((column) => column.name)).toEqual(
      expect.arrayContaining(['id', 'email', 'password_hash', 'created_at']),
    );
  });
});
