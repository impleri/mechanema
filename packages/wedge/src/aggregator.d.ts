import { Map } from 'immutable';
import { Reducer } from 'redux';
import { IStateMachineHash } from './state-machine';
export declare function createRootReducer(): Reducer;
export declare function registerReducer(namespace: string, reducerFn: Reducer): void;
export declare function registerStateMachine(namespace: string, machineDefinition: IStateMachineHash, initialState?: Map<{}, {}>): Reducer;
