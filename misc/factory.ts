/**
 * Options for creating a factory.
 * @template T - The type of object that the factory will create.
 * @template TParams - The type of parameters that will be passed to the factory's create and recreate methods.
 */
export interface IFactoryOptions<T, TParams> {
  /** The set of objects that the factory will manage. */
  readonly list?: Set<T>;

  /** Creates a new instance of the object that the factory will manage. */
  create(params: TParams): T;

  /**
   * Re-creates an existing instance of the object that the factory manages.
   * This method is called when the factory needs to recycle an existing object instead of creating a new one.
   */
  recreate(instance: T, params: TParams): void;

  /** Called when an object is disposed of by the factory. */
  onDispose?(value: T): void;

  /** Called when a new object is created by the factory. */
  onCreate?(value: T): void;
}

/**
 * A factory for managing a set of objects of a specific type.
 * @template T - The type of object that the factory manages.
 * @template TParams - The type of parameters that will be passed to the factory's create and recreate methods.
 */
export interface IFactory<T, TParams> {
  /** Creates a new instance of the object that the factory manages. */
  create(params: TParams): T;

  /** Disposes of an object that the factory manages. */
  dispose(value: T): void;
}

/**
 * Creates a new factory for managing a set of objects of a specific type.
 * @template T - The type of object that the factory will manage.
 * @template TParams - The type of parameters that will be passed to the factory's create and recreate methods.
 * @param options - The options for the factory.
 * @returns A new factory for managing objects of type T.
 */
export function createFactory<T, TParams>({
  list = new Set<T>(),
  create,
  recreate,
  onCreate,
  onDispose,
}: IFactoryOptions<T, TParams>): IFactory<T, TParams> {
  return {
    create(params: TParams) {
      const iter = list.values().next();

      if (!iter.done) {
        const item = iter.value;
        list.delete(item);

        recreate(item, params);

        onCreate?.(item);

        return item;
      } else {
        const item = create(params);
        onCreate?.(item);

        return item;
      }
    },

    dispose(value: T) {
      onDispose?.(value);
      list.add(value);
    },
  };
}
