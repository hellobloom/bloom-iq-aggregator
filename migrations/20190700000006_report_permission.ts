import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  knex.schema.createTable('report_permissions', t => {
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

    t.specificType('permit_sig', 'secp256k1_signature').notNullable()
    t.text('permit_plaintext').notNullable()

    t.specificType('revoke_sig', 'secp256k1_signature')
    t.text('revoke_plaintext', 'secp256k1_signature')
  })
}

export async function down(knex: Knex): Promise<any> {
  knex.schema.dropTable('report_permissions')
}
