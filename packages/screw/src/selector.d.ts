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
export declare function getSlice(namespace: string): ISelector;
declare type selectorFnType = ISelector | IConstant;
export declare function createSelector(mixedParam: ISelector | selectorFnType[] | any, selectorFn?: ISelector): ISelector;
export {};
