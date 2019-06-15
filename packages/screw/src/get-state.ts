import { INIT, KEY_STATE } from '@mechanema/wedge';
import { Collection, RecordOf } from 'immutable';

import { createSelector, ISelector } from './selector';

type MachineState = string | symbol;
type NamespaceId = string | symbol;

export function getStateSelector<
  StoreState extends Collection<any, any>,
  SliceShape extends object = {}
>(
  namespace: NamespaceId,
  stateKey = KEY_STATE,
  initState = INIT,
): ISelector<MachineState, StoreState> {
  const selectorFn: ISelector<MachineState, RecordOf<SliceShape>> = (
    sliceState: RecordOf<SliceShape>,
  ): MachineState => sliceState.get(stateKey, initState);

  return createSelector<MachineState, StoreState, RecordOf<SliceShape>>(namespace, selectorFn);
}
