export interface IMetaBinarySearch {
  start: number;
  end: number;
  sign: 0 | -1 | 1;
  cursor: number;
}

/**
 * Performs a binary search on a sorted list.
 *
 * @template T, V
 * @param {T[]} list - The sorted list to search.
 * @param {V} target - The target value to search for.
 * @param {function(T, V): 0 | -1 | 1} cmp - A function that compares two values and returns -1, 0, or 1 to indicate which one is smaller, equal, or greater.
 * @param {(start: number, end: number) => void} [meta] - A function to call with the start and end indices of the search range after each iteration.
 * @returns {number} The index of the target value, or -1 if it is not found.
 */
export function binarySearch<T, V>(
  list: T[],
  target: V,
  cmp: (num: T, target: V, index: number, list: T[]) => 0 | -1 | 1,
  meta?: (d: IMetaBinarySearch) => void,
): number {
  let start = 0;
  let end = list.length - 1;
  let i = -1;
  let sign: 0 | -1 | 1 = 0;

  while (start <= end) {
    // eslint-disable-next-line no-bitwise
    i = start + ~~((end - start) / 2);

    const item = list[i];
    const cmpResult = cmp(item, target, i, list);

    if (cmpResult === 0) {
      meta?.({
        start,
        end,
        sign: 0,
        cursor: i,
      });

      return i;
    }

    if (cmpResult === 1) {
      sign = 1;
      start = i + 1;
    } else {
      sign = -1;
      end = i - 1;
    }
  }

  meta?.({
    start,
    end,
    sign,
    cursor: i,
  });

  return -1;
}
