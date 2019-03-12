import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

const INIT = 'INIT';
const KEY_STATE = 'machineState';
function traverseReducerArray(reducerArray) {
    return (state, action) => reducerArray.reduce((newState, reducerSlice) => reducerSlice(newState, action), state);
}
function createStateMachine(machineHash, initialState = Map(), initialMachineState = INIT, machineStateKey = KEY_STATE) {
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

const REGISTRY = {};
function createRootReducer() {
    return combineReducers(REGISTRY);
}
function registerReducer(namespace, reducerFn) {
    if (Object.prototype.hasOwnProperty.call(REGISTRY, namespace)) {
        throw new Error('Namespace already registed for the store.');
    }
    REGISTRY[namespace] = reducerFn;
}
function registerStateMachine(namespace, machineDefinition, initialState = Map()) {
    const stateMachine = createStateMachine(machineDefinition, initialState);
    registerReducer(namespace, stateMachine);
    return stateMachine;
}

function createReducer(onAction, stateFn) {
    return (state, action) => {
        if (action && action.type === onAction) {
            return stateFn(state, action.payload || action, action);
        }
        return state;
    };
}

export { createRootReducer, registerReducer, registerStateMachine, createReducer, INIT, KEY_STATE, traverseReducerArray, createStateMachine };
