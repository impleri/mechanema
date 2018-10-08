import { createSelector, getSlice } from '../dist/screw';

// would correspond to same namespace on the reducer (see @mechanema/wedge)
const namespace = 'somewhere';

export const simple = createSelector(namespace, sliceState => sliceState.get('magic', Map()));

export const complex = createSelector([
  getSlice(namespace),
  () => 'property',
  (sliceState, identifier) => sliceState.getIn(['map', identifier], Map()),
]);

export const complicated = createSelector([
  complex,
  simple,
  (thing, other) => `${thing} x ${other}`,
]);
