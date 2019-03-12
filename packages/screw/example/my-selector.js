// eslint-disable-next-line import/no-extraneous-dependencies
import { createSelector, getSlice } from '@mechanema/screw';

// would correspond to same namespace on the reducer (see @mechanema/wedge)
const namespace = 'somewhere';

export const simple = createSelector(namespace, sliceState => sliceState.get('magic', Map()));

export const complex = createSelector([
  getSlice(namespace),
  simple,
  () => 'property',
  (sliceState, magic, identifier) => sliceState.getIn(['map', identifier], Map()).merge(magic),
]);

export const complicated = createSelector([
  complex,
  simple,
  (thing, other) => `${thing} x ${other}`,
]);
