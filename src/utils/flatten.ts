export const flatten = <T>(array: Array<T>): T | Array<T> =>
  array.reduce((prev, cur) => prev.concat(Array.isArray(cur) ? flatten(cur) : cur), <Array<T>>[]);
