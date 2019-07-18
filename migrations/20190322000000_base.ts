import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  knex.schema
    .raw('create extension if not exists "pgcrypto" schema public')
    .raw('create extension if not exists "uuid-ossp" schema public')
    .raw('create extension if not exists "postgis" schema public')
}

export async function down(knex: Knex): Promise<any> {}
