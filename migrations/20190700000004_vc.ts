import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  knex.schema.createTable('vcs', t => {
    t.uuid('id').primary()
    t.timestamps()

    t.uuid('subject_id')
      .index()
      .notNullable()
    t.specificType('subject_addr', 'ethereum_address')
      .index()
      .notNullable()

    t.specificType('aggregator_addr', 'ethereum_address')
      .index()
      .notNullable()

    t.text('type')
      .index()
      .notNullable()
    t.specificType('types', 'text array')
      .index()
      .notNullable()

    t.jsonb('data')
      .notNullable()
      .index()
    t.boolean('submitted')
      .notNullable()
      .defaultTo(false)
    t.jsonb('batch_proof')
      .notNullable()
      .index()
  })
}

export async function down(knex: Knex): Promise<any> {
  knex.schema.dropTable('vcs')
}
