import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  knex.schema.createTable('admins', t => {
    t.uuid('id').primary()
    t.specificType('addr', 'ethereum_address')
    t.timestamps()
  })
}

export async function down(knex: Knex): Promise<any> {
  knex.schema.dropTable('admins')
}
