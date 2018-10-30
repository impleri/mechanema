// @flow strict

import { INIT, KEY_STATE } from '@mechanema/wedge';
import type { Collection } from 'immutable';
import createSelector from './selector';
import type { SelectorMethod } from './selector';

export default function getStateSelector(
  namespace: string,
  stateKey: string = KEY_STATE,
  initState: string = INIT,
): SelectorMethod {
  return createSelector(
    namespace,
    (sliceState: Collection<any, any>): string => sliceState.get(stateKey, initState),
  );
}
