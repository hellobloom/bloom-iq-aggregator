import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  knex.schema.createTable('addresses', t => {
    t.specificType('addr', 'ethereum_address').primary()
    t.timestamps()
    t.uuid('subject_id').notNullable()
  })
}

export async function down(knex: Knex): Promise<any> {
  knex.schema.dropTable('addresses')
}
