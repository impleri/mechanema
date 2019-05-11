'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var reduxImmutable = require('redux-immutable');
var immutable = require('immutable');

const INIT = 'INIT';
const KEY_STATE = 'machineState';
const stateShape = {
    [KEY_STATE]: INIT,
};
const stateFactory = immutable.Record(stateShape);
const stateRecord = stateFactory();
function traverseReducerArray(reducerArray) {
    return (state, action) => reducerArray.reduce((newState, reducerCallback) => reducerCallback(newState, action), state);
}
function createStateMachine(machineHash, initialState, initialMachineState = INIT) {
    let baseState = initialState || stateRecord;
    if (initialMachineState !== INIT) {
        const customState = {
            machineState: initialMachineState,
        };
        baseState = stateFactory(customState);
    }
    return (state = baseState, action) => {
        const currentState = state.get(KEY_STATE, initialMachineState);
        let reducerCallback = machineHash[initialMachineState];
        if (currentState && machineHash[currentState]) {
            reducerCallback = machineHash[currentState];
        }
        if (Array.isArray(reducerCallback)) {
            reducerCallback = traverseReducerArray(reducerCallback);
        }
        return reducerCallback(state, action);
    };
}
function changeStateTo(newState) {
    return (state) => state.set(KEY_STATE, newState);
}
function changeState(state, newState) {
    return changeStateTo(newState)(state);
}

const REGISTRY = {};
function createRootReducer() {
    return reduxImmutable.combineReducers(REGISTRY);
}
function registerReducer(namespace, reducerFn) {
    if (Object.prototype.hasOwnProperty.call(REGISTRY, namespace)) {
        throw new Error('Namespace already registed for the store.');
    }
    REGISTRY[namespace] = reducerFn;
}
function registerStateMachine(namespace, machineDefinition, initialState) {
    const stateMachine = createStateMachine(machineDefinition, initialState);
    registerReducer(namespace, stateMachine);
    return stateMachine;
}

function isPayloadAction(toBeDetermined) {
    return (toBeDetermined.payload);
}
function createReducer(onAction, stateFn) {
    return (state, action) => {
        if (action && action.type === onAction) {
            const payload = (isPayloadAction(action)) ? action.payload : action;
            return stateFn(state, payload, action);
        }
        return state;
    };
}

exports.INIT = INIT;
exports.KEY_STATE = KEY_STATE;
exports.changeState = changeState;
exports.changeStateTo = changeStateTo;
exports.createReducer = createReducer;
exports.createRootReducer = createRootReducer;
exports.createStateMachine = createStateMachine;
exports.registerReducer = registerReducer;
exports.registerStateMachine = registerStateMachine;
exports.stateShape = stateShape;
exports.traverseReducerArray = traverseReducerArray;
