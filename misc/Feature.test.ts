import { Defer } from '@writerai/utils';
import { autorun, observable, runInAction, when } from 'mobx';
import { Feature } from './Feature';

describe('Feature', () => {
  describe('Feature.toCallDispose', () => {
    const { toCallDispose } = Feature;
    const setup = () => {
      const d = {
        state: true,
        counterCb: 0,
      };

      const push = (st: boolean) => {
        d.state = st;
      };
      const call = () => {
        d.counterCb++;
      };

      return { d, push, call };
    };

    it('undefined', () => {
      const { d, push } = setup();
      expect(d.state).toBe(true);
      toCallDispose(undefined, push);
      expect(d.state).toBe(false);
    });

    it('function', () => {
      const { d, call, push } = setup();
      expect(d.state).toBe(true);
      toCallDispose(call, push);
      expect(d.counterCb).toBe(1);
      expect(d.state).toBe(false);
    });

    it('array function', () => {
      const { d, call, push } = setup();
      expect(d.state).toBe(true);

      toCallDispose([call, call], push);
      expect(d.counterCb).toBe(2);
      expect(d.state).toBe(false);
    });
  });

  it('getId', () => {
    let init = false;
    const id = observable.box<boolean>(undefined);
    const setState = (v: boolean | undefined) => runInAction(() => id.set(v));

    const scope = new Feature({
      name: 'test',
      getId: () => (id.get() ? true : undefined),
      feature: () => {
        init = true;

        return () => {
          init = false;
        };
      },
    });

    const cancel = autorun(() => scope.data);
    expect(init).toBe(false);

    setState(true);
    expect(init).toBe(true);

    setState(false);
    expect(init).toBe(false);

    setState(true);
    expect(init).toBe(true);

    cancel();
    expect(init).toBe(false);
  });

  it('isEnabled', () => {
    let init = false;
    const id = observable.box<boolean>(false);
    const setState = (v: boolean) => runInAction(() => id.set(v));

    const scope = new Feature({
      name: 'test',
      isEnabled: () => id.get(),
      feature: () => {
        init = true;

        return () => {
          init = false;
        };
      },
    });

    const cancel = autorun(() => scope.data);
    expect(init).toBe(false);

    setState(true);
    expect(init).toBe(true);

    setState(false);
    expect(init).toBe(false);

    setState(true);
    expect(init).toBe(true);

    cancel();
    expect(init).toBe(false);
  });

  it('async feature', async () => {
    const val = observable.box(42);
    const defer = new Defer<void>();
    let value = 0;
    const feature = new Feature({
      getId: () => val.get(),
      async feature(val) {
        value = val;
        await defer.promise;
      },
    });
    const cancel = autorun(() => feature.data);
    expect(value).toBe(42);
    runInAction(() => val.set(3));
    expect(value).toBe(42);
    defer.resolve();

    await when(() => feature.data === true, { timeout: 100 });
    await defer.promise;
    await when(() => feature.data === true, { timeout: 100 });

    expect(value).toBe(3);
    cancel();
  });
});
