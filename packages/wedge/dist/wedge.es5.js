'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var immutable = require('immutable');
var reduxImmutable = require('redux-immutable');

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
  initialState = immutable.Map(),
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
  return reduxImmutable.combineReducers(REGISTRY);
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
 * @param {string}    namespace         Key to identify reducer slice for redux.
 * @param {object}    machineDefinition State Machine definition to use.
 * @return {function} State machine Reducer function
 */
function registerStateMachine(
  namespace,
  machineDefinition,
) {
  const stateMachine = createStateMachine(machineDefinition);

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
 * @param {Immutable.Collection} initialState Defined initial state for the
 *                                            reducer slice.
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
function createReducerFactory() {
  return (onAction, stateFn) => createReducer(onAction, stateFn);
}

exports.createRootReducer = createRootReducer;
exports.createReducerFactory = createReducerFactory;
exports.registerReducer = registerReducer;
exports.registerStateMachine = registerStateMachine;
exports.createReducer = createReducer;
exports.INIT = INIT;
exports.KEY_STATE = KEY_STATE;
exports.traverseReducerArray = traverseReducerArray;
exports.createStateMachine = createStateMachine;
