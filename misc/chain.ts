/**
 * A generic chain builder class that can create a type-safe chain of values.
 * @template TSource The source type that is being chained.
 * @template Target The target type that is being built by the chain.
 * @template TEnumType The enum type that is used to build the chain.
 */
export class Chain<TSource, Target extends unknown[], TEnumType extends unknown[]> {
  /**
   * The source array that is being chained.
   * @type {TSource[]}
   */
  readonly source: TSource[];

  /**
   * The target array that is being built by the chain.
   * @type {Target}
   */
  readonly target: Target;

  /**
   * The enum type for typeof instance.type
   * @type {TEnumType[number]}
   */
  readonly type = null as unknown as TEnumType[number];

  /**
   * Builds a new instance of the `Chain` class.
   * @param {TSource[]} source The source array to be chained.
   * @param {Target} target The target array to be built by the chain.
   */
  static build<TSource>(source: TSource[]) {
    return new Chain<TSource, [], []>(source, []);
  }

  /**
   * Creates a new instance of the `Chain` class.
   * @param {TSource[]} source The source array to be chained.
   * @param {Target} target The target array to be built by the chain.
   */
  private constructor(source: TSource[], target: Target) {
    this.source = source;
    this.target = target;
  }

  /**
   * Creates a new instance of the specified type.
   * @template T The type of the instance to be created.
   * @param {T} t The instance to be created.
   * @returns {T} The instance of the specified type.
   */
  // eslint-disable-next-line class-methods-use-this
  create<T extends TEnumType[number]>(t: T): T {
    return t;
  }

  /**
   * Removes the specified type from the source array.
   * @template TType The type of the instance to be removed.
   * @param {T} type The instance to be removed.
   * @returns {Chain<Exclude<TSource, T>, [...Target, T], [...TEnumType, readonly [T, TType]]>} The new `Chain` instance.
   */
  popType<TType>() {
    return <T extends TSource>(type: T) => {
      const source = this.source.filter(s => s !== type);
      const target = [...this.target, type] as const;

      return new Chain<
        Exclude<TSource, T>,
        [...Target, T],
        [...TEnumType, readonly [T, TType]]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      >(source as any, target as any);
    };
  }

  /**
   * Asserts that the source array is empty.
   * @returns {Chain<TSource, Target, TEnumType>} The current `Chain` instance.
   * @throws {Error} If the source array is not empty.
   */
  assert() {
    if (this.source.length) {
      throw new Error("source isn't empty");
    }

    return this;
  }
}
