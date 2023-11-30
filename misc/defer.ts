import type { NotReadonly } from './types';

/**
 * A helper class to manage a promise that is resolved outside of its executor function
 * @template T The resolved value type of the promise
 */
export class Defer<T> {
  /** A function that resolves the promise with the given value */
  public readonly resolve!: (data: T) => void;

  /** A function that rejects the promise with the given error */
  public readonly reject!: (err: Error) => void;

  /** The promise object to manage */
  public readonly promise = new Promise<T>((resolve, reject) => {
    const t = this as NotReadonly<typeof this>;

    t.resolve = resolve;
    t.reject = reject;
  });
}
