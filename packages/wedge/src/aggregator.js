import { combineReducers } from 'redux-immutable';

import { createStateMachine } from './state-machine';

/**
 * Internal registry to aggregate reducers.
 */
const REGISTRY = {};

/**
 * Create Root Reducer
 *
 * Generates an Immutable-based reducer to inject into config.
 * @return {function} Root reducer function.
 */
export default function createRootReducer() {
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
export function registerReducer(namespace, reducerFn) {
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
export function registerStateMachine(namespace, machineDefinition) {
  const stateMachine = createStateMachine(machineDefinition);

  registerReducer(namespace, stateMachine);
}
