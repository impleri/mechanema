import { RecordOf } from 'immutable';
import { Action, Reducer } from 'redux';
declare type IPayload = any;
export interface IReducerSlice<S = any, P = IPayload, A = any> {
    (state: RecordOf<S> | undefined, payload: Action<A> | P, action: Action<A>): RecordOf<S>;
}
export interface IPayloadAction<T = any, P = IPayload> extends Action<T> {
    payload?: P;
}
export declare function createReducer<S = any, A extends Action<any> = IPayloadAction>(onAction: string | symbol, stateFn: IReducerSlice<S>): Reducer<RecordOf<S>, A>;
export {};
