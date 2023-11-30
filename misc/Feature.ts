import type { IReactionDisposer } from 'mobx';
import { autorun, observable, runInAction } from 'mobx';
import type { ISubscriberProps } from './Subscriber';
import { Subscriber } from './Subscriber';

export type TDispose = void | (() => void) | Array<() => void>;
export type TPromise<T> = T | Promise<T>;

export type IFeatureParams<T> = Omit<ISubscriberProps<T, boolean>, 'subscribe' | 'getId' | 'autoclear'> & {
  feature: (params: T) => TPromise<TDispose>;
} & (
    | { getId: ISubscriberProps<T, boolean>['getId'] }
    | {
        isEnabled: () => Exclude<T, undefined>;
      }
  );

export class Feature<T> extends Subscriber<T, boolean> {
  static isDispose(ctx: TPromise<TDispose>): ctx is TDispose {
    return !ctx || Array.isArray(ctx) || ctx instanceof Function;
  }

  static toCallDispose(result: TDispose, push?: (s: boolean) => void) {
    if (!result) {
      push?.(false);

      return;
    }

    if (Array.isArray(result)) {
      result.forEach(cb => cb());
      push?.(false);
    } else if (result instanceof Function) {
      result();
      push?.(false);
    } else {
      throw new Error('unreachable');
    }
  }

  private readonly cancelationInProgress = observable.box(false);

  constructor({ feature, ...params }: IFeatureParams<T>) {
    super({
      ...params,
      getId: (
        (getId): (() => T | undefined) =>
        () => {
          if (this.cancelationInProgress.get()) {
            return undefined;
          }

          return getId();
        }
      )('getId' in params ? params.getId : () => params.isEnabled() || undefined),

      subscribe: (args, push) => {
        const ctx = feature(args);

        if (Feature.isDispose(ctx)) {
          push(true);

          return () => Feature.toCallDispose(ctx, push);
        } else {
          ctx.then(() => push(true));

          return () => {
            runInAction(() => this.cancelationInProgress.set(true));

            ctx
              .then(cb => Feature.toCallDispose(cb, push))
              .finally(() => {
                runInAction(() => this.cancelationInProgress.set(false));
              });
          };
        }
      },
    });
  }

  run(): IReactionDisposer {
    return autorun(() => this.data);
  }
}
