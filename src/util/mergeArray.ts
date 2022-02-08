/** 複数の配列を重複は除去して合成 */
export const mergeArray = <T>(...args: T[][]): T[] => {
  const result: Set<T> = new Set();

  for (const arg of args) {
    for (const x of arg) result.add(x);
  }

  return [...result];
};
