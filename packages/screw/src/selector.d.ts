import { Collection } from 'immutable';
export interface ISelector<Value = any, State = any> {
    (state: State): Value;
    isMoized?: boolean;
}
export interface IConstant<Value = string> {
    (): Value;
    isMoized?: boolean;
}
export interface IAggregator<Value = any> {
    (...parameters: any[]): Value;
}
declare type selectorFnType<Value = any, State = any> = ISelector<Value, State> | IConstant<Value>;
export declare function getSlice<State = any, NamespaceId = string | symbol>(namespace: NamespaceId): ISelector<State, Collection<NamespaceId, State>>;
export declare function createSelector<Value = any, State = any, Params = any>(mixedParam: selectorFnType<Value, State> | selectorFnType<Value, State | Params>[] | string | symbol | keyof State, selectorFn?: selectorFnType<Value, Params> | IAggregator<Value>): ISelector<Value, State>;
export {};
