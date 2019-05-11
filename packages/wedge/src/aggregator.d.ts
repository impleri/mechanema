import { RecordOf } from 'immutable';
import { Reducer } from 'redux';
import { IStateMachine, IStateMachineHash } from './state-machine';
export declare function createRootReducer(): Reducer;
export declare function registerReducer(namespace: string, reducerFn: Reducer): void;
export declare function registerStateMachine<S = IStateMachine>(namespace: string, machineDefinition: IStateMachineHash, initialState?: RecordOf<S>): Reducer;
