import knex from 'knex'

const nodeEnv = process.env.NODE_ENV || 'development'
const knexConfig = require('../../knexfile')[nodeEnv]

export const db = knex(knexConfig)

// export type Serialize<T> = {[p in keyof T]: T[p] extends Buffer ? string : T[p]}

// export type Serialize<T> = {[p in keyof T]: T[p] extends Buffer ? string : Serialize<T[p]>}
// ^ This is the correct one, but has moved to @src/types

////////////////////////////////////////////////////
// Basic model methods
////////////////////////////////////////////////////

export const mkCreate = <M extends Record<string, any>>(m: knex.QueryBuilder) => {
  return async (attrs: Partial<M>): Promise<M> => {
    return await m.insert(attrs).returning('*')
  }
}

export const mkCreateMany = <M extends Record<string, any>>(m: knex.QueryBuilder) => {
  return async (attrs: Partial<M>[]): Promise<M[]> => {
    return await m.insert(attrs).returning('*')
  }
}

export const mkFindById = <M extends Record<string, any>, TIDAttr extends keyof M>(m: knex.QueryBuilder, pkeyAttr: TIDAttr) => {
  return async (pkey: M[TIDAttr]): Promise<M> => {
    return await m.where(pkeyAttr, pkey as any).select('*')
  }
}

export const mkFindWhere = <M extends Record<string, any>>(m: knex.QueryBuilder) => {
  return async (whereAttrs: Partial<M>): Promise<M> => {
    return await m
      .where(whereAttrs as any)
      .select('*')
      .limit(1)[0]
  }
}

export const mkWhere = <M extends Record<string, any>>(m: knex.QueryBuilder) => {
  return async (whereAttrs: Partial<M>): Promise<M[]> => {
    return await m.where(whereAttrs as any).select('*')
  }
}

export const mkAll = <M extends Record<string, any>>(m: knex.QueryBuilder) => {
  return async (): Promise<M[]> => {
    return await m.select('*')
  }
}

export const mkDeleteOne = <M extends Record<string, any>, TIDAttr extends keyof M>(m: knex.QueryBuilder, pkeyAttr: TIDAttr) => {
  return async (pkey: M[TIDAttr]): Promise<M> => {
    return await m.where(pkeyAttr, pkey as any).del()
  }
}

export const mkDeleteAll = <M extends Record<string, any>>(m: knex.QueryBuilder) => {
  return async (whereAttrs: Partial<M>): Promise<M> => {
    return await m.where(whereAttrs as any).del()
  }
}

export const mkUpdateOne = <M extends Record<string, any>, TIDAttr extends keyof M>(m: knex.QueryBuilder, pkeyAttr: TIDAttr) => {
  return async (pkey: M[TIDAttr], updateAttrs: Partial<M>): Promise<M[]> => {
    return await m
      .where(pkeyAttr, pkey as any)
      .update(updateAttrs)
      .returning('*')
  }
}

export const mkUpdateAll = <M extends Record<string, any>>(m: knex.QueryBuilder) => {
  return async (whereAttrs: Partial<M>, updateAttrs: Partial<M>): Promise<void> => {
    return await m.where(whereAttrs as any).update(updateAttrs)
  }
}
