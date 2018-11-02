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
export function createReducer(
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

type CreateReducerMethod = (onAction: string, stateFn: SliceMethod) => ReducerMethod;

/**
 * Create Reducer Factory
 *
 * Factory method to inject a single initial state into multiple calls to
 * createReducer.
 * @param {Immutable.Collection} initialState Initial state to use for reducer
 *                                            methods.
 * @return {function}                         Curried proxy to createReducer.
 * @deprecated
 */
export default function createReducerFactory(): CreateReducerMethod {
  return (onAction, stateFn) => createReducer(onAction, stateFn);
}
