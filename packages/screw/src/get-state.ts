import { INIT, KEY_STATE } from '@mechanema/wedge';
import { Collection } from 'immutable';

import { createSelector, ISelector } from './selector';

// eslint-disable-next-line import/prefer-default-export
export function getStateSelector(
  namespace: string,
  stateKey = KEY_STATE,
  initState = INIT,
): ISelector {
  return createSelector(
    namespace,
    (sliceState: Collection<any, any>): string => sliceState.get(stateKey, initState),
  );
}
