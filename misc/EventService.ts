import type { ObservableSet } from 'mobx';
import { makeObservable, computed, autorun, observable, createAtom, runInAction, action } from 'mobx';
import { getLogger } from '@writerai/utils';
import { Subscriber } from './Subscriber';

/**
 * This is an interface definition for the Event Service options.
 */
export interface IEventServiceOptions<TSource, TEvent, TOptions> {
  /**
   * Property that specifies the name of the servuce.
   */
  name?: string;

  /**
   * A method that determines whether the event service is enabled or not.
   */
  isEnabled(): boolean;

  /**
   * A method that returns the source of the event. The source can be of type TSource or undefined.
   */
  getSource(): TSource | undefined;

  /**
   *
   * @param source A method that subscribes to the event. It takes a source of type TSource, a callback function (callback) which accepts an event of type TEvent, and optional options of type TOptions.
   * @param callback - callback for subscription
   * @param options - option for subscription
   */
  subscribe(source: TSource, callback: (ev: TEvent) => void, options?: TOptions): () => void;

  // An optional hash function that compares two sets of options (existOpts and newOpts) and returns a boolean value indicating whether they are equal or not.
  hash?: (existOpts: TOptions, newOpts: TOptions) => boolean;
}

const logger = getLogger('EventService', '@writerai/mobx');

let ID = 0;
/**
 * Represents an event service.
 * @template TSource - The source type of the events.
 * @template TEvent - The event type.
 * @template TOptions - The options type for the events.
 */
export class EventService<TSource, TEvent, TOptions = void> {
  /**
   * Subscribes to an event and returns a function to unsubscribe from the event.
   * @param {Function} cb - The callback function to be invoked when the event is triggered.
   * @param {TOptions} options - The options for the event.
   * @returns {Function} - A function that can be used to unsubscribe from the event.
   */
  readonly on: (cb: (ev: TEvent) => void, options: TOptions) => () => void;

  /**
   * Represents the current state of the event service.
   * @readonly
   * @type {boolean}
   */
  readonly state!: boolean;

  /**
   * The name of the event service.
   * @readonly
   * @type {string}
   */
  readonly name: string;

  /**
   * Stores the events along with their options and callbacks.
   * @protected
   * @type {ObservableSet<{
   *   options: TOptions;
   *   list: Set<(e: TEvent) => void>;
   *   callback: (e: TEvent) => void;
   * }>}
   */
  protected readonly events: ObservableSet<{
    options: TOptions;
    list: Set<(e: TEvent) => void>;
    callback: (e: TEvent) => void;
  }> = observable.set([], { deep: false });

  /**
   * Creates a new instance of the EventService class.
   * @param {{ getSource: Function, isEnabled: Function, hash?: Function, subscribe: Function, name?: string }} options - The options for the event service.
   */
  constructor({
    getSource,
    isEnabled,
    hash = (a, b) => a === b,
    subscribe,
    name = `EventService-${ID++}`,
  }: IEventServiceOptions<TSource, TEvent, TOptions>) {
    this.name = name;

    /**
     * Subscriber object that handles the subscription logic for the events.
     * @type {Subscriber<[TSource, TItem[]], boolean>}
     */
    const subscriber = new Subscriber<[TSource, TItem[]], boolean>({
      name: `${name}_subscriber`,
      getId: () => {
        if (!isEnabled() || !this.events.size) {
          return undefined;
        }

        const source = getSource();

        if (!source) {
          return undefined;
        }

        return [source, Array.from(this.events.values())];
      },
      subscribe: ([source, events], push) => {
        push(true);

        const cancel = events.flatMap(ref => subscribe(source, ref.callback, ref.options));

        return () => {
          cancel.forEach(cb => cb());
          push(false);
        };
      },
    });

    /**
     * Type for the event handler function.
     * @type {(e: TEvent) => void}
     */
    type THandler = (e: TEvent) => void;

    /**
     * Type for the item stored in the events set.
     * @type {{
     *   options: TOptions;
     *   list: Set<THandler>;
     *   callback: THandler;
     * }}
     */
    type TItem = {
      options: TOptions;
      list: Set<THandler>;
      callback: THandler;
    };

    /**
     * Adds a callback function to an event reference.
     * @param {TItem} ref - The event reference to add the callback to.
     * @param {THandler} cb - The callback function to add.
     * @returns {Function} - A function that can be used to remove the callback from the event reference.
     */
    const add = (ref: TItem, cb: THandler) => {
      runInAction(() => ref.list.add(cb));

      return () =>
        runInAction(() => {
          ref.list.delete(cb);

          if (ref.list.size === 0) {
            this.events.delete(ref);
          }
        });
    };

    /**
     * Subscribes to an event and returns a function to unsubscribe from the event.
     * @param {Function} cb - The callback function to be invoked when the event is triggered.
     * @param {TOptions} options - The options for the event.
     * @returns {Function} - A function that can be used to unsubscribe from the event.
     */
    this.on = action((cb, options) => {
      for (const p of this.events) {
        if (hash(p.options, options)) {
          return add(p, cb);
        }
      }

      const list = new Set<THandler>();
      const ref: TItem = {
        callback: ev => list.forEach(cb => cb(ev)),
        options,
        list,
      };

      this.events.add(ref);

      const dispose = add(ref, cb);

      return dispose;
    });

    // Defines the "state" property as a computed property based on the subscriber data.
    Object.defineProperty(this, 'state', {
      configurable: true,
      enumerable: true,
      get: () => !!subscriber.data,
    });

    // Adds the "state" property as a computed property using the makeObservable function.
    makeObservable(this, {
      state: computed,
    });
  }

  /**
   * Runs the event service and returns a function to stop autorun.
   * @returns {Function} - A function that can be used to stop the autorun.
   */
  run(): () => void {
    logger.debug('run');

    return autorun(() => this.state);
  }
}
