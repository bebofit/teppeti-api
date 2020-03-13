export type IPartialRecord<K extends string | number | symbol, T> = Partial<
  Record<K, T>
>;
