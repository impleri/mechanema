export const INIT = 'INIT';

export const KEY_STATE = 'machineState';

export function traverseReducerArray(reducerArray) {
  return (state, action) => reducerArray.reduce(
    (newState, reducerSlice) => reducerSlice(newState, action),
    state,
  );
}

export function createStateMachine(
  machineHash,
  initialMachineState = INIT,
  machineStateKey = KEY_STATE,
) {
  return (state, action) => {
    const currentState = state.get(machineStateKey, INIT);

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
