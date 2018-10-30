// @flow strict

import { Map } from 'immutable';
import type { Collection } from 'immutable';

/**
 * The predefined initial/fallback state
 */
export const INIT = 'INIT';

/**
 * The predefined property key to use for tracking current state of the
 * reducer slice.
 */
export const KEY_STATE = 'machineState';

export type Action = {type: string, payload: ?any};
export type ReducerMethod = (state: Collection<any, any>, action: ?Action) => Collection<any, any>;
export type StateMachineHash = {
  [state: string]: ReducerMethod | Array<ReducerMethod>
};

/**
 * Traverse Reducer Array
 *
 * Iterates over an array of reducer slice methods to generate a single change
 * of state in redux store.
 * @param {Array<ReducerMethod>} reducerArray Array of reducer methods (generally
 *                                            created via createReducer from
 *                                            `./reducer-slide`).
 * @return {ReducerMethod}       Standard reducer function.
 */
export function traverseReducerArray(reducerArray: Array<ReducerMethod>): ReducerMethod {
  return (
    state: Collection<any, any>,
    action: ?Action,
  ): Collection<any, any> => reducerArray.reduce(
    (
      newState: Collection<any, any>,
      reducerSlice: ReducerMethod,
    ): Collection<any, any> => reducerSlice(newState, action),
    state,
  );
}

/**
 * Create State Machine
 *
 * Translates a Hashmap of state-based reducer into a standard reducer function.
 * @param {object}     machineHash     Hashmap of (state => reducer).
 * @param {Collection} initialState    Defined initial state for the
 *                                     reducer slice.
 * @param {string} initialMachineState Value for the initial/fallback state.
 * @param {string} machineStateKey     Key where the reducer slice's state is stored.
 */
export function createStateMachine(
  machineHash: StateMachineHash,
  initialState: Collection<any, any> = Map(),
  initialMachineState: string = INIT,
  machineStateKey: string = KEY_STATE,
): ReducerMethod {
  return (state: Collection<any, any> = initialState, action: ?Action): Collection<any, any> => {
    const currentState: string = state.get(machineStateKey, initialMachineState);

    let reducerCallback: ReducerMethod | Array<ReducerMethod> = machineHash[initialMachineState];
    if (currentState && Object.prototype.hasOwnProperty.call(machineHash, currentState)) {
      reducerCallback = machineHash[currentState];
    }

    if (Array.isArray(reducerCallback)) {
      reducerCallback = traverseReducerArray(reducerCallback);
    }

    return reducerCallback(state, action);
  };
}
