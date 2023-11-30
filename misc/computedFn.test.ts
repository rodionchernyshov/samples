import { autorun, observable, runInAction } from 'mobx';
import { computedFn } from './computedFn';

describe('computedFn', () => {
  it('test', () => {
    let counter = 0;
    let result = -1;

    const arg = observable.box(5);
    const mul10 = computedFn((num: number) => {
      counter++;

      return num * 10;
    });

    const cancel = autorun(() => {
      result = mul10(arg.get());
    });

    const calc = (v: number) => {
      runInAction(() => arg.set(v));

      return result;
    };

    expect(calc(5)).toBe(50);
    expect(counter).toBe(1);

    expect(calc(5)).toBe(50);
    expect(counter).toBe(1);

    expect(calc(4)).toBe(40);
    expect(counter).toBe(2);

    expect(calc(4)).toBe(40);
    expect(counter).toBe(2);

    expect(calc(5)).toBe(50);
    expect(counter).toBe(3);

    cancel();
  });
});
