import type { IObservableValue } from 'mobx';
import { observable, runInAction, when } from 'mobx';
import { EventService } from './EventService';

describe('EventService', () => {
  let cancel: () => void;
  let service: MockService;
  let emitter: Map<boolean, Set<(ev: string) => void>>;
  let source: IObservableValue<number>;
  let enabled: IObservableValue<boolean>;
  let emit: (msg: string, options: boolean) => void;

  class MockService extends EventService<number, string, boolean> {
    getEvents() {
      return this.events;
    }
  }

  beforeEach(() => {
    emit = (msg, options) => emitter.get(options)?.forEach(cb => cb(msg));
    emitter = new Map();
    enabled = observable.box(true);
    source = observable.box(1);
    service = new MockService({
      getSource: () => source.get(),
      isEnabled: () => enabled.get(),
      subscribe: (source, cb, options = false) => {
        const push = (str: string) => cb(`${source}:${str}`);

        const ref = emitter.get(options);

        if (ref) {
          ref.add(push);
        } else {
          emitter.set(options, new Set([push]));
        }

        return () => {
          emitter.get(options)?.delete(push);
        };
      },
    });

    cancel = service.run();
  });

  afterEach(() => {
    emitter.clear();
    cancel?.();
  });

  it('test single options', () => {
    const state: string[] = [];
    service.on(msg => state.push(msg), true);
    emit('msg1', true);

    expect(state).toEqual(['1:msg1']);

    runInAction(() => enabled.set(false));

    emit('msg2', true);

    expect(state).toEqual(['1:msg1']);
  });

  it('test multiple options', () => {
    const state1: string[] = [];
    service.on(msg => state1.push(msg), true);

    const state2: string[] = [];
    service.on(msg => state2.push(msg), false);

    emit('msg1', true);
    emit('msg2', false);
    expect(state1).toEqual(['1:msg1']);
    expect(state2).toEqual(['1:msg2']);

    runInAction(() => enabled.set(false));
    emit('msg1', true);
    emit('msg2', false);
    expect(state1).toEqual(['1:msg1']);
    expect(state2).toEqual(['1:msg2']);
  });

  it('state with on', async () => {
    expect(service.state).toBe(false);
    const dispose = service.on(() => {
      // pass
    }, true);
    expect(service.state).toBe(true);
    expect(service.getEvents().size).toBe(1);
    dispose();
    expect(service.getEvents().size).toBe(0);
    expect(service.state).toBe(false);
  });

  it('state with on and cancel runnign', async () => {
    expect(service.state).toBe(false);
    const dispose = service.on(() => {
      // pass
    }, true);
    expect(service.state).toBe(true);
    cancel();
    expect(service.state).toBe(false);
  });
});
