import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

const baseColumns: TableColumnOptions[] = [
  {
    name: 'id',
    type: 'int4',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
  },
  { name: 'created_by', type: 'varchar', isNullable: true },
  {
    name: 'created_at',
    type: 'timestamptz',
    isNullable: true,
    default: 'now()',
  },
  { name: 'updated_by', type: 'varchar', isNullable: true },
  { name: 'updated_at', type: 'timestamptz', isNullable: true },
  { name: 'deleted_by', type: 'varchar', isNullable: true },
  { name: 'deleted_at', type: 'timestamptz', isNullable: true },
];

export class CreateUsers1756280000000 implements MigrationInterface {
  name = 'CreateUsers1756280000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          ...baseColumns,
          { name: 'name', type: 'varchar', isNullable: false },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          { name: 'password', type: 'varchar', isNullable: false },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
