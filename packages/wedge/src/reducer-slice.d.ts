import { Action, Reducer } from 'redux';
declare type IPayload = any;
export interface IReducerSlice<S = any, A = any> {
    (state: S | undefined, payload: Action<A> | IPayload, action: Action<A>): S;
}
export interface IPayloadAction extends Action {
    payload?: IPayload;
}
export declare function createReducer<S = any, A extends Action<any> = IPayloadAction>(onAction: string | symbol, stateFn: IReducerSlice<S>): Reducer<S, A>;
export {};
