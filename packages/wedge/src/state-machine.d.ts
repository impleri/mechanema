import { Collection } from 'immutable';
import { Reducer } from 'redux';
export declare const INIT = "INIT";
export declare const KEY_STATE = "machineState";
export interface IStateMachineHash {
    [state: string]: Reducer | Reducer[];
}
export declare function traverseReducerArray(reducerArray: Reducer[]): Reducer;
export declare function createStateMachine(machineHash: IStateMachineHash, initialState?: Collection<any, any>, initialMachineState?: string, machineStateKey?: string): Reducer;
