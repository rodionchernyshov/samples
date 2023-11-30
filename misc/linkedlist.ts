/* eslint-disable no-param-reassign */
export const NONE = typeof Symbol === 'function' ? Symbol.for('NONE') : ({} as symbol);

export interface LinkedItemList<T> {
  data: T | symbol;
  prev: LinkedItemList<T> | null;
  next: LinkedItemList<T> | null;
}

let removedItems: LinkedItemList<unknown> = { data: null, prev: null, next: null };

export function get<T>(item: LinkedItemList<T>): T | null {
  if (item.data === NONE) {
    return null;
  }

  return item.data as T;
}

export function toArray<T>(list: LinkedItemList<T>, direction?: 'prev' | 'next') {
  const result: T[] = [];
  each(
    list,
    item => {
      result.push(item);
    },
    direction,
  );

  return result;
}

export function persist(item: LinkedItemList<unknown>) {
  item.next = removedItems;
  item.prev = null;
  item.data = null;
  removedItems = item;
}

export function isEmpty<T>(list?: LinkedItemList<T>): boolean {
  if (!list) {
    return true;
  } else {
    return list.prev === list.next && list.prev === list;
  }
}

export function init<T>(): LinkedItemList<T> {
  const list: LinkedItemList<T> = { data: NONE, next: null, prev: null };
  list.next = list;
  list.prev = list;

  return list;
}

/**
 * add item to tail of list
 */
export function add<T>(data: T, list: LinkedItemList<T>): LinkedItemList<T> {
  if ((data as unknown as symbol) === NONE) {
    return list;
  }

  // create new item or peek from existing
  let item: LinkedItemList<T>;

  const last = list.prev;

  if (!removedItems.next) {
    item = {
      data,
      prev: last,
      next: list,
    };
  } else {
    item = removedItems as LinkedItemList<T>;
    removedItems = removedItems.next;
    item.data = data;
    item.prev = last;
    item.next = list;
  }

  if (last) {
    last.next = item;
  }

  list.prev = item;

  return item;
}

export function detach<T>(list: LinkedItemList<T>) {
  if (!(list.prev === list.next && list.prev === list)) {
    // ([next ->] prev -> list -> next [-> prev]) => ([next ->] prev -> next [-> prev])

    const { prev, next } = list;

    // (prev2 -> prev -> list -> next -> next2) => (prev2 -> list -> next2)
    list.next = next ? next.next : null;
    list.prev = prev ? prev.prev : null;

    if (prev) {
      // (prev -> list -> next') => (prev -> next')
      prev.next = next;

      // (next <- list <- prev) => (next <- prev)
      if (prev.prev === list) {
        prev.prev = list.prev;
      }
    }

    if (next) {
      next.prev = prev;

      if (next.next === list) {
        next.next = list.next;
      }
    }

    persist(list);
  }
}

export function nodeIterator<T>(
  list: LinkedItemList<T>,
  direction: 'next' | 'prev' = 'next',
): Iterator<LinkedItemList<T>> {
  let value = list;

  return {
    next: () => {
      const cursor = value[direction];

      if (!cursor || cursor.data === NONE) {
        return { done: true, value: null };
      }

      value = cursor;

      return { done: false, value };
    },
  };
}

export function nodeIterable<T>(
  list: LinkedItemList<T>,
  direction: 'next' | 'prev' = 'next',
): Iterable<LinkedItemList<T>> {
  return {
    [Symbol.iterator]() {
      return nodeIterator(list, direction);
    },
  };
}

export function valueIterable<T>(list: LinkedItemList<T>, direction: 'next' | 'prev' = 'next'): Iterable<T> {
  return {
    [Symbol.iterator]() {
      const iter = nodeIterator(list, direction);

      return {
        next: () => {
          const node = iter.next();

          if (node.done) {
            return node;
          }

          // we know that value exists
          const value = get(node.value) as T;

          return { done: false, value };
        },
      };
    },
  };
}

export function each<T>(
  list: LinkedItemList<T>,
  fn: (item: T, ptr: LinkedItemList<T>) => void | undefined | boolean,
  direction: 'next' | 'prev' = 'next',
) {
  const iter = nodeIterable(list, direction);

  for (const node of iter) {
    if (node.data !== NONE) {
      fn(node.data as T, node);
    }
  }
}

export function filter<T>(list: LinkedItemList<T>, test: (item: T) => boolean) {
  each(list, (item, ptr) => {
    if (!test(item)) {
      detach(ptr);
    }
  });
}

export function shift<T>(list: LinkedItemList<T>): T | null {
  if (list.prev === list.next && list.prev === list) {
    // isEmpty
    return null;
  } else {
    const first = list.next;
    const second = first ? first.next : null;
    // (list -> first) (list <- first -> second)
    // (list -> second) (list <- first -> second)
    list.next = second;

    // (list -> second) (list <- second)
    if (second) {
      second.prev = list;
    }

    if (first) {
      const { data } = first;
      persist(first);

      return data === NONE ? null : (data as T);
    }

    return null;
  }
}

export function pop<T>(list: LinkedItemList<T>): T | null {
  if (list.prev === list.next && list.prev === list) {
    // isEmpty
    return null;
  } else {
    const first = list.prev;
    const second = first ? first.prev : null;
    // (second -> first -> list) (first <- list)
    // (second -> first -> list) (second <- list)
    list.prev = second;
    // (second -> list) (second <- list)

    if (second) {
      second.next = list;
    }

    if (first) {
      const { data } = first;
      persist(first);

      return data === NONE ? null : (data as T);
    }

    return null;
  }
}
