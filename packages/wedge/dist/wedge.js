import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

//  strict

/**
 * The predefined initial/fallback state
 */
const INIT = 'INIT';

/**
 * The predefined property key to use for tracking current state of the
 * reducer slice.
 */
const KEY_STATE = 'machineState';


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
function traverseReducerArray(reducerArray) {
  return (
    state,
    action,
  ) => reducerArray.reduce(
    (
      newState,
      reducerSlice,
    ) => reducerSlice(newState, action),
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
function createStateMachine(
  machineHash,
  initialState = Map(),
  initialMachineState = INIT,
  machineStateKey = KEY_STATE,
) {
  return (state = initialState, action) => {
    const currentState = state.get(machineStateKey, initialMachineState);

    let reducerCallback = machineHash[initialMachineState];
    if (currentState && Object.prototype.hasOwnProperty.call(machineHash, currentState)) {
      reducerCallback = machineHash[currentState];
    }

    if (Array.isArray(reducerCallback)) {
      reducerCallback = traverseReducerArray(reducerCallback);
    }

    return reducerCallback(state, action);
  };
}

//  strict

/**
 * Internal registry to aggregate reducers.
 */
const REGISTRY = {};

/**
 * Create Root Reducer
 *
 * Generates an Immutable-based reducer to inject into config.
 * @return {ReducerMethod} Root reducer function.
 */
function createRootReducer() {
  return combineReducers(REGISTRY);
}

/**
 * Register Reducer
 *
 * Adds a reducer at to the registry at the specified namespace key.
 * @param {string}   namespace Key to identify reducer slice for redux.
 * @param {function} reducerFn Reducer method to use ((state, action) => newState).
 * @throws {Error} If namespace key already exists in registry.
 */
function registerReducer(namespace, reducerFn) {
  if (Object.prototype.hasOwnProperty.call(REGISTRY, namespace)) {
    throw new Error('Namespace already registed for the store.');
  }

  REGISTRY[namespace] = reducerFn;
}

/**
 * Register State Machine
 *
 * Adds a state machine reducer to the registry at the specified namespace key.
 * @param {string}     namespace           Key to identify reducer slice for redux.
 * @param {object}     machineDefinition   State Machine definition to use.
 * @param {Collection} initialState        Defined initial state for the
 *                                         reducer slice.
 * @return {function}  State machine Reducer function
 */
function registerStateMachine(
  namespace,
  machineDefinition,
  initialState = Map(),
) {
  const stateMachine = createStateMachine(machineDefinition, initialState);

  registerReducer(namespace, stateMachine);

  return stateMachine;
}

//  strict



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
function createReducer(
  onAction,
  stateFn,
) {
  return (state, action) => {
    if (action && action.type === onAction) {
      return stateFn(state, action.payload || action, action);
    }

    return state;
  };
}

export { createRootReducer, createReducer, registerReducer, registerStateMachine, INIT, KEY_STATE, traverseReducerArray, createStateMachine };
