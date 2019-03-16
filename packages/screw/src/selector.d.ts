import { Collection } from 'immutable';
export interface ISelector {
    (state: Collection<any, any>): any;
    isMoized?: boolean;
}
export interface IConstant {
    (): any;
    isMoized?: boolean;
}
export interface IAggregator {
    (...parameters: any): any;
}
declare type selectorFnType = ISelector | IConstant;
export declare function getSlice(namespace: string): ISelector;
export declare function createSelector(mixedParam: selectorFnType | selectorFnType[] | any, selectorFn?: selectorFnType): ISelector;
export {};
