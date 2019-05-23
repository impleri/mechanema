import { Record, RecordOf } from 'immutable';
import { Action, AnyAction, Reducer } from 'redux';
export declare const INIT = "INIT";
export declare const KEY_STATE = "machineState";
export interface IStateMachineHash {
    [state: string]: Reducer | Reducer[];
}
export interface IStateMachine {
    machineState: string | symbol;
}
export declare const stateShape: IStateMachine;
export declare const stateFactory: Record.Factory<IStateMachine>;
export declare function traverseReducerArray<S = IStateMachine, A extends Action = AnyAction>(reducerArray: Reducer<RecordOf<S>, A>[]): Reducer<RecordOf<S>, A>;
export declare function createStateMachine<S = IStateMachine, A extends Action = AnyAction>(machineHash: IStateMachineHash, initialState?: RecordOf<S>, initialMachineState?: string): Reducer<RecordOf<S>, A>;
declare type IChangeState<S extends IStateMachine> = (state: RecordOf<S>) => RecordOf<S>;
export declare function changeStateTo<S extends IStateMachine>(newState: string | symbol): IChangeState<S>;
export declare function changeState<S extends IStateMachine>(state: RecordOf<S>, newState: string | symbol): RecordOf<S>;
export {};
