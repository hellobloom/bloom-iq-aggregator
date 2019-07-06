export type Serialize<T> = {
  [p in keyof T]: Required<T>[p] extends Buffer ? string : Serialize<T[p]>
}
