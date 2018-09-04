import { combineReducers } from 'redux-immutable';

import { createStateMachine } from './state-machine';

const REGISTRY = {};

export default function createRootReducer() {
  return combineReducers(REGISTRY);
}

export function registerReducer(reducerFn, namespace) {
  REGISTRY[namespace] = reducerFn;
}

export function registerStateMachine(machineDefinition, namespace) {
  const stateMachine = createStateMachine(machineDefinition);

  return registerReducer(stateMachine, namespace);
}
