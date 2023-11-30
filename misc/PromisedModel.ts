import { computed, makeObservable, createAtom, when, untracked } from 'mobx';
import type { IEqualsComparer } from 'mobx';

import isEqual from 'lodash/isEqual';
import { getLogger } from '@writerai/utils';
import { PromisedError } from './PromisedError';
import { Subscriber } from './Subscriber';
import { PromiseData } from './PromiseData';

const logger = getLogger('PromisedModel');

export interface TPromisedModelOpts {
  expired: (timeout: number) => void;
  debounce: <O>(timeout: number, fn: () => Promise<O>) => Promise<O>;
  wait: <O>(
    fn: () => Promise<O>,
    retryPolicy: (attepms: number, err: unknown) => boolean | Promise<boolean>,
  ) => Promise<O>;
}

export type TPromisedModelParams<T> = (opt: TPromisedModelOpts) => Promise<T>;

export interface IPromisedModelParams<T> {
  load: TPromisedModelParams<T>;
  equals?: IEqualsComparer<T>;
  name?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TData<T extends any[]> = T extends [head: infer THead, ...tail: infer Tail]
  ? [THead extends PromisedModel<infer O> ? O : never, ...TData<Tail>]
  : [];

export class PromisedModel<T> {
  readonly name: string;
  private readonly atomReload = createAtom('reload');

  static isValue<T>(val: T | undefined | PromisedError): val is T {
    return val !== undefined && !(val instanceof PromisedError);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static compose<T extends PromisedModel<any>[]>(...args: T) {
    const defers = args.map(a => {
      when(() => a.promise !== undefined);

      return a.promise;
    });

    return new PromisedModel<TData<T>>(() => Promise.all(defers) as unknown as Promise<TData<T>>);
  }

  static ID = 0;

  constructor(private options: IPromisedModelParams<T> | TPromisedModelParams<T>) {
    this.name = (!(options instanceof Function) ? options.name : undefined) ?? `PromisedModel-${PromisedModel.ID++}`;

    const equals = (!(options instanceof Function) ? options.equals : undefined) ?? isEqual;

    this.subscription = new Subscriber<Promise<T>, PromiseData<T>>({
      name: this.name,
      getId: () => {
        logger.debug(this.name, 'getId');
        this.atomReload.reportObserved();

        const load = this.options instanceof Function ? this.options : this.options.load;

        let start: undefined | (() => void);
        const expired = (timeout: number) => {
          start = this.expired(timeout);
        };

        let defer: Promise<T>;
        try {
          defer = load({
            debounce: this.debounce as unknown as TPromisedModelOpts['debounce'],
            expired,
            wait: this.wait as unknown as TPromisedModelOpts['wait'],
          }).catch(err => {
            throw new PromisedError(err);
          });
        } catch (err) {
          defer = Promise.reject(new PromisedError(err));
        }

        if (start) {
          defer.then(
            () => start?.(),
            () => ({}),
          );
        }

        return defer;
      },

      subscribe: (promise, fn) => {
        logger.debug(this.name, 'subscribe');
        const prevValue = untracked(() => this.subscription.data?.value);
        const data = new PromiseData(promise, prevValue);

        fn(data);

        return () => {
          logger.debug(this.name, 'unsubscribe');
        };
      },
    });
    makeObservable(this, {
      value: computed({
        equals,
      }),
      valueWithError: computed({
        equals,
      }),
      status: computed,
    });
  }

  public disposeKeepAlive?: () => void;
  public readonly reload = () => this.atomReload.reportChanged();

  protected readonly subscription: Subscriber<Promise<T>, PromiseData<T>>;

  private $debounce?: {
    id: number;
    reject: (err: unknown) => void;
  };

  private wait = async (
    fn: () => Promise<T>,
    retryPolicy: (attepms: number, err: unknown) => boolean | Promise<boolean>,
    attepms = 0,
  ): Promise<T> => {
    try {
      const data = await fn();

      return data;
    } catch (err) {
      const isRetry = await retryPolicy(attepms, err);

      if (isRetry) {
        return this.wait(fn, retryPolicy, attepms + 1);
      } else {
        throw err;
      }
    }
  };

  private debounce = (timeout: number, fn: () => Promise<T>) => {
    logger.debug(this.name, 'debounce', timeout);

    if (this.$debounce) {
      clearTimeout(this.$debounce.id);
      this.$debounce.reject('timeout');
      this.$debounce = undefined;
    }

    return new Promise<void>((resolve, reject) => {
      const id = setTimeout(() => {
        this.$debounce = undefined;
        resolve();
      }, timeout) as unknown as number;
      this.$debounce = { id, reject };
    }).then(() => fn());
  };

  private expiredAtom = createAtom('expiredAtom');

  private expiredAtomTimeout?: number;

  private expired = (timeout: number) => {
    logger.debug(this.name, 'expired', timeout);
    this.expiredAtom.reportObserved();

    if (this.expiredAtomTimeout) {
      clearTimeout(this.expiredAtomTimeout);
      this.expiredAtomTimeout = undefined;
    }

    // eslint-disable-next-line no-return-assign
    return () =>
      (this.expiredAtomTimeout = setTimeout(() => {
        this.expiredAtom.reportChanged();

        this.expiredAtomTimeout = undefined;
      }, timeout) as unknown as number);
  };

  get promise() {
    if (!this.subscription.data) {
      logger.debug(this.name, 'promise', 'call promise outside context');
      // if subscription doesn't have data
      // this means that it outside context and is called first time
      // we call it inside context to make cache data
      when(() => this.subscription.data?.promise !== undefined, {
        timeout: 1,
      });
    } else {
      logger.debug(this.name, 'promise');
    }

    return this.subscription.data?.promise as Promise<T>;
  }

  get status() {
    const status = this.subscription.data?.status;
    logger.debug(this.name, 'status', status);

    return status ?? 'pending';
  }

  get valueWithError(): PromisedError | T | undefined {
    return this.subscription.data?.value;
  }

  get value() {
    const val = this.valueWithError;
    logger.debug(this.name, 'value', val);

    return val instanceof PromisedError ? undefined : val;
  }
}
