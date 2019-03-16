import { Map } from 'immutable';
import { Action, Reducer } from 'redux';
export interface IReducerSlice {
    (state: Map<any, any>, payload: Action | any, action: Action): Map<any, any>;
}
export interface IPayloadAction extends Action {
    payload?: any;
}
export declare function createReducer(onAction: string, stateFn: IReducerSlice): Reducer;
