import { INIT, KEY_STATE } from '@mechanema/wedge';
import createSelector from './selector';

export default function getStateSelector(namespace, stateKey = KEY_STATE, initState = INIT) {
  return createSelector(namespace, sliceState => sliceState.get(stateKey, initState));
}
