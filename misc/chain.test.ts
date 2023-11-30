import { Chain } from './chain';
import { Enum } from './enum';

describe('chain', () => {
  it('test', () => {
    const T_ENUM = new Enum('one', 'two');
    const T_CHAIN = Chain.build(T_ENUM.list)
      .popType<{
        one: boolean;
      }>()(T_ENUM.enum.one)
      .popType<{ two: number }>()(T_ENUM.enum.two)
      .assert();

    ((_: ['one', { one: boolean }]) => {
      // pass
    })(T_CHAIN.create(['one', { one: true }]));

    ((_: ['two', { two: number }]) => {
      // pass
    })(T_CHAIN.create(['two', { two: 1 }]));
  });

  it('assert', () => {
    const T_ENUM = new Enum('one', 'two');
    expect(() => {
      Chain.build(T_ENUM.list)
        .popType<{
          one: boolean;
        }>()(T_ENUM.enum.one)
        .assert();
    }).toThrow();
  });
});
