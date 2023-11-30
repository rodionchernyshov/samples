import { autorun } from 'mobx';
import { createAtomSubscriber } from './atomSubscriber';

describe('createAtomSubscriber', () => {
  it('test', () => {
    let subscribe = 0;
    let unsubsribe = 0;
    const atom = createAtomSubscriber('test', () => {
      subscribe++;

      return () => {
        unsubsribe++;
      };
    });

    const cancel1 = autorun(() => atom.reportObserved());
    expect(subscribe).toBe(1);
    expect(unsubsribe).toBe(0);

    const cancel2 = autorun(() => atom.reportObserved());
    expect(subscribe).toBe(1);
    expect(unsubsribe).toBe(0);

    cancel1();
    expect(subscribe).toBe(1);
    expect(unsubsribe).toBe(0);

    cancel2();
    expect(subscribe).toBe(1);
    expect(unsubsribe).toBe(1);

    const cancel3 = autorun(() => atom.reportObserved());
    expect(subscribe).toBe(2);
    expect(unsubsribe).toBe(1);

    cancel3();
    expect(subscribe).toBe(2);
    expect(unsubsribe).toBe(2);
  });
});
