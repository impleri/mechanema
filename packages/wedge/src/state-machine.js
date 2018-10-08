/**
 * The predefined initial/fallback state
 */
export const INIT = 'INIT';

/**
 * The predefined property key to use for tracking current state of the
 * reducer slice.
 */
export const KEY_STATE = 'machineState';

/**
 * Traverse Reducer Array
 *
 * Iterates over an array of reducer slice methods to generate a single change
 * of state in redux store.
 * @param {Array<Function>} reducerArray Array of reducer methods (generally
 *                                       created via createReducer from
 *                                       `./reducer-slide`).
 * @return                               Standard reducer function.
 */
export function traverseReducerArray(reducerArray) {
  return (state, action) => reducerArray.reduce(
    (newState, reducerSlice) => reducerSlice(newState, action),
    state,
  );
}

/**
 * Create State Machine
 *
 * Translates a Hashmap of state-based reducer into a standard reducer function.
 * @param {object} machineHash         Hashmap of (state => reducer).
 * @param {string} initialMachineState Value for the initial/fallback state.
 * @param {string} machineStateKey     Key where the reducer slice's state is stored.
 */
export function createStateMachine(
  machineHash,
  initialMachineState = INIT,
  machineStateKey = KEY_STATE,
) {
  return (state, action) => {
    const currentState = state.get(machineStateKey, initialMachineState);

    let reducerCallback = machineHash[initialMachineState];
    if (Object.prototype.hasOwnProperty.call(machineHash, currentState)) {
      reducerCallback = machineHash[currentState];
    }

    if (Array.isArray(reducerCallback)) {
      reducerCallback = traverseReducerArray(reducerCallback);
    }

    return reducerCallback(state, action);
  };
}
