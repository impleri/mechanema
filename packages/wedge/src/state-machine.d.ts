import { RecordOf } from 'immutable';
import { Reducer } from 'redux';
export declare const INIT = "INIT";
export declare const KEY_STATE = "machineState";
export interface IStateMachineHash {
    [state: string]: Reducer | Reducer[];
}
export interface IStateMachine {
    machineState: string | symbol;
}
export declare const stateShape: IStateMachine;
export declare function traverseReducerArray<S = RecordOf<IStateMachine>>(reducerArray: Reducer[]): Reducer;
export declare function createStateMachine<S = IStateMachine>(machineHash: IStateMachineHash, initialState?: RecordOf<S>, initialMachineState?: string): Reducer<RecordOf<S>>;
declare type IChangeState<S extends IStateMachine> = (state: RecordOf<S>) => RecordOf<S>;
export declare function changeStateTo<S extends IStateMachine>(newState: string | symbol): IChangeState<S>;
export declare function changeState<S extends IStateMachine>(state: RecordOf<S>, newState: string | symbol): RecordOf<S>;
export {};
