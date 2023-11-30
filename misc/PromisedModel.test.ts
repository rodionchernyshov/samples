import { autorun, computed, createAtom, makeObservable, observable, runInAction, untracked, when } from 'mobx';
import { PromisedError } from './PromisedError';
import { PromisedModel } from './PromisedModel';

describe('PromisedModel', () => {
  let cancel: Array<() => void> = [];
  afterEach(() => {
    cancel.forEach(cb => cb());
    cancel = [];
  });

  it('isValue', () => {
    expect(PromisedModel.isValue<number | PromisedError>(1)).toBe(true);
    expect(PromisedModel.isValue<number | PromisedError>(undefined)).toBe(false);
    expect(PromisedModel.isValue<number | PromisedError>(new PromisedError(''))).toBe(false);
  });

  it('reload', async () => {
    let counter = 0;
    const model = new PromisedModel(async () => {
      counter++;

      return counter;
    });
    const state: unknown[] = [];
    cancel[cancel.length] = autorun(() => {
      state.push(model.value);
    });

    await when(() => model.value === 1);
    expect(state).toEqual([undefined, 1]);
    model.reload();

    await when(() => model.value !== 1);
    expect(state).toEqual([undefined, 1, 2]);
  });

  it('error', async () => {
    const model = new PromisedModel<number>(async () => {
      throw new Error('error');
    });
    const state: unknown[] = [];
    await when(
      () => {
        state.push(model.valueWithError);

        return model.valueWithError !== undefined;
      },
      { timeout: 100 },
    );

    expect(state.length).toBe(2);
    expect(state[0]).toBeUndefined();
    expect(state[1]).toBeInstanceOf(PromisedError);
  });

  it('autorun error', async () => {
    const model = new PromisedModel<number>(async () => {
      throw new Error('error');
    });
    const state: unknown[] = [];
    cancel[cancel.length] = autorun(() => {
      state.push(model.value);
    });
    const status: string[] = [];
    cancel[cancel.length] = autorun(() => {
      status.push(model.status);
    });

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(state.length).toBe(1);
    expect(status).toEqual(['pending', 'rejected']);
  });

  it('value', async () => {
    const model = new PromisedModel<number>(() => Promise.resolve(42));
    const state: unknown[] = [];
    await when(() => {
      state.push(model.valueWithError);

      return model.valueWithError !== undefined;
    });

    expect(state.length).toBe(2);
    expect(state[0]).toBeUndefined();
    expect(state[1]).toBe(42);
  });

  it('value after update', async () => {
    class Test {
      constructor() {
        makeObservable(this, {
          num: observable,
        });
      }

      num = 42;

      model = new PromisedModel<number>(() => Promise.resolve(this.num));
    }

    const test = new Test();

    const state: unknown[] = observable.array([]);

    const cancel = autorun(() => {
      state.push(test.model.value);
    });

    expect(state).toEqual([undefined]);
    expect(test.model.status).toBe('pending');
    await when(() => test.model.status !== 'pending');
    expect(state).toEqual([undefined, 42]);

    runInAction(() => {
      test.num = 11;
    });

    expect(test.model.status).toBe('pending');
    await when(() => test.model.status !== 'pending');
    expect(state).toEqual([undefined, 42, 11]);
    cancel();
  });

  it('update value without change value', async () => {
    const atom = createAtom('test');
    const model = new PromisedModel<{ value: number }>(() => {
      atom.reportObserved();

      return Promise.resolve({ value: 42 });
    });

    const state: unknown[] = observable.array([]);
    const cancel = autorun(() => {
      state.push(model.value);
    });

    expect(model.status).toBe('pending');
    await when(() => model.status !== 'pending');
    expect(state).toEqual([undefined, { value: 42 }]);

    atom.reportChanged();
    expect(model.status).toBe('pending');
    await when(() => model.status !== 'pending');
    expect(state).toEqual([undefined, { value: 42 }]);

    cancel();
  });

  describe('wait', () => {
    it('success', async () => {
      let counter = 0;
      const errors: string[] = [];
      const attempts: number[] = [];
      const model = new PromisedModel<number>(async t =>
        t.wait(
          async () => {
            if (counter < 3) {
              throw new Error(`waiting ${counter}`);
            }

            return 42;
          },
          (attemp, err) => {
            attempts.push(attemp);
            errors.push(err instanceof Error ? err.message : 'unknowns');
            counter++;

            return true;
          },
        ),
      );
      await when(() => model.value === 42);
      expect(counter).toBe(3);
      expect(errors).toEqual(['waiting 0', 'waiting 1', 'waiting 2']);
      expect(attempts).toEqual([0, 1, 2]);
    });

    it('error', async () => {
      const model = new PromisedModel<number>(async t =>
        t.wait(
          async () => {
            throw new Error('waiting');
          },
          attemps => attemps < 3,
        ),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let ret: any;
      await when(() => {
        ret = model.valueWithError;

        return model.valueWithError !== undefined;
      });

      expect(ret.error.message).toMatch('waiting');
    });
  });

  it('expired', async () => {
    let result = 0;
    let start = 0;
    let end = 0;
    const model = new PromisedModel<number>(t => {
      t.expired(50);
      result++;
      end = performance.now();

      if (!start) {
        start = end;
      }

      return Promise.resolve(result);
    });

    await when(() => model.value === 3);

    expect(model.value).toBe(3);
    // on CI it could be different time
    const eps = 0.98;
    expect(end - start).toBeGreaterThan(100 * eps);
  });

  it('expired process', async () => {
    let counter = 0;
    const start = performance.now();
    const model = new PromisedModel<number>(async t => {
      t.expired(50);
      counter++;

      return counter;
    });

    await when(() => model.value === 3);
    const end = performance.now();
    expect(counter).toBe(3);
    const diff = end - start;
    expect(diff).toBeGreaterThanOrEqual(100);
    expect(diff).toBeLessThan(150);
  });

  it('debounce', async () => {
    let result = 0;
    const TIMEOUT = 50;
    const atom = createAtom('test');
    const model = new PromisedModel<number>(t => {
      atom.reportObserved();

      return t.debounce(TIMEOUT, () => {
        result++;

        return Promise.resolve(result);
      });
    });

    const $value = observable.box<number | undefined>(undefined);
    cancel[cancel.length] = autorun(() => {
      const { value } = model;
      runInAction(() => $value.set(value));
    });

    await when(() => $value.get() === 1, { timeout: 500 });
    const start = performance.now();
    expect($value.get()).toBe(1);
    atom.reportChanged();
    atom.reportChanged();
    atom.reportChanged();
    expect($value.get()).toBe(1);

    await when(() => $value.get() === 2);
    const end = performance.now();
    expect($value.get()).toBe(2);
    expect(end - start).toBeGreaterThanOrEqual(TIMEOUT);
    expect(end - start).toBeLessThan(TIMEOUT * 2);
  });

  it('compose', async () => {
    const model1 = new PromisedModel<number>(async () => 42);
    const model2 = new PromisedModel<string>(async () => 'hello');

    const cmodel = PromisedModel.compose(model1, model2);

    await when(() => cmodel.status === 'fulfilled', { timeout: 100 });

    const data = await cmodel.promise;
    expect(data).toEqual([42, 'hello']);
  });

  it('call promise outside reaction', async () => {
    const model = new PromisedModel<number>(async () => 42);
    const data = await model.promise;
    expect(data).toBe(42);
  });

  it('deps', async () => {
    const model1 = new PromisedModel({
      load: () => Promise.resolve(42),
      name: 'model1',
    });

    const val = observable.box(11);
    const model2 = new PromisedModel({
      load: () => Promise.resolve(val.get()),
      name: 'model2',
    });
    let count = 0;
    const model = new PromisedModel({
      load: async () => {
        count++;
        const [a, b] = await Promise.all([model1.promise, model2.promise]);

        return a + b;
      },
      name: 'compose-model',
    });

    const state: unknown[] = [];

    const cancel = autorun(() => {
      state.push(model.value);
    });

    await when(() => model.value !== undefined);

    expect(state).toEqual([undefined, 53]);
    expect(count).toBe(2);

    runInAction(() => val.set(0));
    await when(() => model.value !== 53);
    expect(state).toEqual([undefined, 53, 42]);
    expect(count).toBe(3);

    cancel();
  });

  describe('context', () => {
    let cancel: undefined | (() => void);
    afterEach(() => {
      cancel?.();
      cancel = undefined;
    });

    it('running outside reaction', async () => {
      let counter = 0;
      const model = new PromisedModel<number>(async () => {
        counter++;

        return 42;
      });
      const fn = computed(() => model.value);
      expect(fn.get()).toBe(undefined);
      expect(counter).toBe(0);

      await when(() => model.status !== 'pending');
      expect(fn.get()).toBe(42);
      expect(counter).toBe(1);
      expect(fn.get()).toBe(42);
      expect(counter).toBe(1);
    });

    it('running in outside and inside reaction context', async () => {
      const value = observable.box(42);
      let counter = 0;
      const model = new PromisedModel<number>(async () => {
        counter++;

        return value.get();
      });
      cancel = autorun(() => {
        // eslint-disable-next-line no-unused-expressions
        model.value;
      });

      expect(counter).toBe(1);
      expect(model.value).toBe(undefined);
      expect(counter).toBe(1);

      await when(() => model.value !== undefined);
      expect(model.value).toBe(42);
      expect(counter).toBe(1);

      // update
      runInAction(() => value.set(12));
      expect(counter).toBe(2);
      await when(() => model.value === value.get());
      expect(model.value).toBe(12);
    });
  });
});
