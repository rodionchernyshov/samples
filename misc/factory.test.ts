/* eslint-disable no-param-reassign */
import type { IFactory } from './factory';
import { createFactory } from './factory';

describe('factory', () => {
  class Test {
    public value: number;

    public text: string;

    constructor(value: number, text: string) {
      this.value = value;
      this.text = text;
    }
  }

  it('test callbacks', () => {
    let onCreate = 0;
    let onDispose = 0;
    const list = new Set<Test>();
    const factory = createFactory({
      list,
      create: ([value, text]) => new Test(value, text),
      recreate: (item, [value, text]) => {
        item.text = text;
        item.value = value;
      },
      onCreate() {
        onCreate++;
      },
      onDispose() {
        onDispose++;
      },
    });

    const item1 = new Test(1, '1');
    factory.dispose(item1);
    expect(onCreate).toBe(0);
    expect(onDispose).toBe(1);
    expect(list.size).toBe(1);

    factory.create([2, '2']);
    expect(onCreate).toBe(1);
    expect(onDispose).toBe(1);
    expect(list.size).toBe(0);

    factory.create([2, '2']);
    expect(onCreate).toBe(2);
    expect(onDispose).toBe(1);
    expect(list.size).toBe(0);
  });

  describe('flow', () => {
    let factory: IFactory<Test, [value: number, text: string]>;
    let list: Set<Test>;

    beforeEach(() => {
      list = new Set<Test>();
      factory = createFactory({
        list,
        create: ([value, text]) => new Test(value, text),
        recreate: (item, [value, text]) => {
          item.text = text;
          item.value = value;
        },
      });
    });

    it('test', () => {
      const item1 = factory.create([1, '1']);
      expect(item1).toBeDefined();
      expect(item1.value).toBe(1);
      expect(item1.text).toBe('1');

      expect(list.size).toBe(0);
      factory.dispose(item1);
      expect(list.size).toBe(1);

      const item3 = factory.create([3, '3']);
      expect(item3).toBe(item1);
      expect(item3.value).toBe(3);
      expect(item3.text).toBe('3');
      expect(list.size).toBe(0);

      const item2 = new Test(2, '2');
      factory.dispose(item2);
      expect(list.size).toBe(1);
      const item4 = factory.create([4, '4']);
      expect(item2).toBe(item4);
      expect(item4.value).toBe(4);
      expect(item4.text).toBe('4');
      expect(list.size).toBe(0);
    });

    it('test double dispose of the same issue', () => {
      const item = new Test(1, '1');

      expect(list.size).toBe(0);
      factory.dispose(item);
      expect(list.size).toBe(1);
      factory.dispose(item);
      expect(list.size).toBe(1);
    });
  });
});
