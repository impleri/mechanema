import { Collection, Map } from 'immutable';
import { Action, Reducer } from 'redux';

/**
 * The predefined initial/fallback state
 */
export const INIT = 'INIT';

/**
 * The predefined property key to use for tracking current state of the
 * reducer slice.
 */
export const KEY_STATE = 'machineState';

export interface IStateMachineHash {
  [state: string]: Reducer | Reducer[];
}

/**
 * Traverse Reducer Array
 *
 * Iterates over an array of reducer slice methods to generate a single change
 * of state in redux store.
 * @param {Array<Reducer>} reducerArray Array of reducer methods (generally
 *                                      created via createReducer from
 *                                      `./reducer-slide`).
 * @return {Reducer}       Standard reducer function.
 */
export function traverseReducerArray(reducerArray: Reducer[]): Reducer {
  return (
    state: Collection<any, any>,
    action: Action,
  ): Collection<any, any> => reducerArray.reduce(
    (
      newState: Collection<any, any>,
      reducerSlice: Reducer,
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
  machineHash: IStateMachineHash,
  initialState: Collection<any, any> = Map(),
  initialMachineState: string = INIT,
  machineStateKey: string = KEY_STATE,
): Reducer {
  return (state: Collection<any, any> = initialState, action: Action): Collection<any, any> => {
    const currentState: string = state.get(machineStateKey, initialMachineState);

    let reducerCallback: Reducer | Reducer[] = machineHash[initialMachineState];
    if (currentState && Object.prototype.hasOwnProperty.call(machineHash, currentState)) {
      reducerCallback = machineHash[currentState];
    }

    if (Array.isArray(reducerCallback)) {
      reducerCallback = traverseReducerArray(reducerCallback);
    }

    return reducerCallback(state, action);
  };
}
