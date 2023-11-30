import isEqual from 'lodash/isEqual';
import type { CreateObservableOptions, IComputedValueOptions } from 'mobx';
import { untracked, observable, computed, runInAction } from 'mobx';

export const computedFn = <T, O>(
  fn: (param: T) => O,
  {
    refOptions,
    computedOptions,
  }: {
    refOptions?: CreateObservableOptions;
    computedOptions?: IComputedValueOptions<O>;
  } = {
    refOptions: { deep: false, equals: isEqual },
    computedOptions: { equals: isEqual },
  },
) => {
  const ref = observable.box<T>(undefined as unknown as T, refOptions);
  const getter = computed(() => fn(ref.get()), computedOptions);
  const eq = refOptions?.equals ?? ((a: T, b: T) => a === b);

  return (param: T) => {
    runInAction(() => {
      const prevParam = untracked(() => ref.get());

      if (!eq(prevParam, param)) {
        ref.set(param);
      }
    });

    return getter.get();
  };
};
