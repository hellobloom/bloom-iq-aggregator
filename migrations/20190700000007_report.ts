import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  knex.schema.createTable('reports', t => {
    t.uuid('id').primary()
    t.timestamps()

    t.uuid('subject_id')
      .index()
      .notNullable()
    t.specificType('subject_addr', 'ethereum_address')
      .index()
      .notNullable()

    t.uuid('reporter_id')
      .index()
      .notNullable()
    t.specificType('reporter_addr', 'ethereum_address')
      .index()
      .notNullable()
    t.specificType('reporter_sig', 'secp256k1_signature').notNullable()

    t.specificType('report_hash', 'sha256digest').notNullable()
    t.specificType('report_encrypted', 'bytea').notNullable()

    t.specificType('revoke_hash', 'sha256digest')
    t.specificType('revoke_encrypted', 'bytea')

    t.specificType('tags', 'text array')
  })
}

export async function down(knex: Knex): Promise<any> {
  knex.schema.dropTable('reports')
}
