import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  knex.schema.createTable('associations', t => {
    t.uuid('id').primary()
    t.timestamps()

    t.uuid('subject_id')
      .index()
      .notNullable()
    t.specificType('subject_addr', 'ethereum_address')
      .index()
      .notNullable()

    t.specificType('allow_association_sig', 'secp256k1_signature').notNullable()
    t.text('allow_association_plaintext').notNullable()

    t.specificType('revoke_association_sig', 'secp256k1_signature')
    t.text('revoke_association_plaintext')
  })
}

export async function down(knex: Knex): Promise<any> {
  knex.schema.dropTable('associations')
}
