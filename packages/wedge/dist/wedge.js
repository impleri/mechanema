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
    state || Map(),
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
function createStateMachine(
  machineHash,
  initialMachineState = INIT,
  machineStateKey = KEY_STATE,
) {
  return (state, action) => {
    const currentState = (state)
      ? state.get(machineStateKey, initialMachineState)
      : undefined;

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
 * @param {string} namespace         Key to identify reducer slice for redux.
 * @param {object} machineDefinition State Machine definition to use.
 */
function registerStateMachine(namespace, machineDefinition) {
  const stateMachine = createStateMachine(machineDefinition);

  registerReducer(namespace, stateMachine);
}

//  strict


/**
 * Create Reducer
 *
 * Creates a reducer function that upserts the redux store when given the
 * expected action.
 * @param {string}               onAction     Expected redux action.
 * @param {Immutable.Collection} initialState Defined initial state for the
 *                                            reducer slice.
 * @param {SliceCallback}        stateFn      Callback to trigger state change
 *                                            if received expected action.
 * @return {ReducerMethod}                    Standard reducer function.
 */
function createReducer(
  onAction,
  initialState,
  stateFn,
) {
  return (state = initialState, action) => {
    if (action && action.type === onAction) {
      return stateFn(state, action.payload, action);
    }

    return state || initialState;
  };
}


/**
 * Create Reducer Factory
 *
 * Factory method to inject a single initial state into multiple calls to
 * createReducer.
 * @param {Immutable.Collection} initialState Initial state to use for reducer
 *                                            methods.
 * @return {function}                         Curried proxy to createReducer.
 */
function createReducerFactory(
  initialState,
) {
  return (onAction, stateFn) => createReducer(onAction, initialState, stateFn);
}

export { createRootReducer, createReducerFactory, registerReducer, registerStateMachine, createReducer, INIT, KEY_STATE, traverseReducerArray, createStateMachine };
