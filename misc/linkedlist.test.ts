/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { add, shift, pop, isEmpty, init, NONE, detach, filter, each, valueIterable } from './linkedlist';

describe('linkedlist', () => {
  it('check correct of list structure', () => {
    const list = init<number>();
    add(1, list);
    expect(list.next).toBe(list.prev);
    expect(list.next).not.toBe(list);
    expect(list.data).toBe(NONE);

    add(2, list);
    expect(list.data).toBe(NONE);
    expect(list.next!.data).toBe(1);
    expect(list.next!.next!.data).toBe(2);
    expect(list.next!.next!.next!.data).toBe(NONE);
    expect(list.prev!.prev!.prev!.data).toBe(NONE);
    expect(list.prev!.prev!.data).toBe(1);
    expect(list.prev!.data).toBe(2);

    add(3, list);
    expect(list.data).toBe(NONE);
    expect(list.next!.data).toBe(1);
    expect(list.next!.next!.data).toBe(2);
    expect(list.next!.next!.next!.data).toBe(3);
    expect(list.next!.next!.next!.next!.data).toBe(NONE);
    expect(list.prev!.prev!.prev!.prev!.data).toBe(NONE);
    expect(list.prev!.prev!.prev!.data).toBe(1);
    expect(list.prev!.prev!.data).toBe(2);
    expect(list.prev!.data).toBe(3);
  });

  it('check shift for list', () => {
    const list = init<number>();
    add(1, list);
    add(2, list);
    add(3, list);

    expect(shift(list)).toBe(1);
    expect(shift(list)).toBe(2);
    expect(shift(list)).toBe(3);
    expect(shift(list)).toBe(null);
    expect(shift(list)).toBe(null);
  });

  it('check pop for list', () => {
    const list = init<number>();
    add(1, list);
    add(2, list);
    add(3, list);

    expect(pop(list)).toBe(3);
    expect(pop(list)).toBe(2);
    expect(pop(list)).toBe(1);
    expect(pop(list)).toBe(null);
    expect(pop(list)).toBe(null);
  });

  it('check init and isEmpty', () => {
    const list = init<number>();
    expect(isEmpty(list)).toBe(true);
    add(1, list);
    expect(isEmpty(list)).toBe(false);
    pop(list);
    expect(isEmpty(list)).toBe(true);
  });

  it('check detach', () => {
    const list = init<number>();
    const a1 = add(1, list);
    const a2 = add(2, list);
    expect(a1.data).toBe(1);
    expect(a2.data).toBe(2);
    detach(a2);
    expect(a1.next).toBe(list);
    expect(a1.prev).toBe(list);
  });

  it('check each', () => {
    const list = init<number>();
    add(1, list);
    add(2, list);
    add(3, list);
    const buf: number[] = [];
    each(list, item => {
      buf.push(item);
    });
    expect(buf).toEqual([1, 2, 3]);
  });

  it('check each prev', () => {
    const list = init<number>();
    add(1, list);
    add(2, list);
    add(3, list);
    const buf: number[] = [];
    each(
      list,
      item => {
        buf.push(item);
      },
      'prev',
    );
    expect(buf).toEqual([3, 2, 1]);
  });

  it('check filter', () => {
    const list = init<number>();
    add(1, list);
    add(2, list);
    add(3, list);

    filter(list, item => item !== 2);

    const buf: number[] = [];
    each(list, item => {
      buf.push(item);
    });
    expect([1, 3]).toEqual(buf);
    expect(list.next!.data).toBe(1);
    expect(list.next!.next!.data).toBe(3);

    const res = [1, 2, 3].filter(t => t !== 2);
    expect([1, 3]).toEqual(res);
  });

  it('iterator', () => {
    const list = init<number>();
    add(1, list);
    add(2, list);
    add(3, list);

    const iter = valueIterable(list, 'next');
    expect(Array.from(iter)).toEqual([1, 2, 3]);

    const iterPrev = valueIterable(list, 'prev');
    expect(Array.from(iterPrev)).toEqual([3, 2, 1]);
  });
});
