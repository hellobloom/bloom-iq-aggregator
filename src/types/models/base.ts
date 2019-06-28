export type Serialize<T> = {[p in keyof T]: T[p] extends Buffer ? string : Serialize<T[p]>}
