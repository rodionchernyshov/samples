import { getLogger } from '@writerai/utils';
import type { IAtom } from 'mobx';
import { createAtom } from 'mobx';

const logger = getLogger('createAtomSubscriber');

export function createAtomSubscriber(name: string, subscribe: () => () => void): IAtom {
  let cancel: undefined | (() => void);
  logger.debug(name, 'construct');

  return createAtom(
    name,
    () => {
      logger.debug(name, 'start observe');
      cancel?.();
      cancel = subscribe();
    },
    () => {
      logger.debug(name, 'stop observe');
      cancel?.();
      cancel = undefined;
    },
  );
}
