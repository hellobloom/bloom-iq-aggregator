import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  knex.schema
    .raw('create extension if not exists "pgcrypto" schema public')
    .raw('create extension if not exists "uuid-ossp" schema public')
    .raw('create extension if not exists "postgis" schema public')
    .raw(`create domain "sha256digest" as bytea check(octet_length(value::bytea) = 32)`)
    .raw(`create domain ethereum_address as bytea constraint address_length check (octet_length(VALUE) = 20);`)
    .raw(
      `create domain secp256k1_signature as bytea constraint signature_length check (octet_length(VALUE) = 65 AND (get_byte(VALUE, 64) = 28 OR get_byte(VALUE, 64) = 27));`
    )
}

export async function down(knex: Knex): Promise<any> {}
