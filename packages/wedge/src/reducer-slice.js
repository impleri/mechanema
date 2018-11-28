// @flow strict

import type { Collection } from 'immutable';
import type { Action, ReducerMethod } from './state-machine';

type SliceMethod = (
  state: Collection<any, any>,
  payload: Collection<any, any> | Action,
  action: Action,
) => Collection<any, any>;

/**
 * Create Reducer
 *
 * Creates a reducer function that upserts the redux store when given the
 * expected action.
 * @param {string}               onAction     Expected redux action.
 * @param {SliceCallback}        stateFn      Callback to trigger state change
 *                                            if received expected action.
 * @return {ReducerMethod}                    Standard reducer function.
 */
export default function createReducer(
  onAction: string,
  stateFn: SliceMethod,
): ReducerMethod {
  return (state: Collection<any, any>, action: ?Action): Collection<any, any> => {
    if (action && action.type === onAction) {
      return stateFn(state, action.payload || action, action);
    }

    return state;
  };
}
