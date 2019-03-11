import { Map } from 'immutable';
import { ISelector } from './selector';
export interface ISelectorHash {
    [key: string]: ISelector;
}
export interface IBoundSelectorHash {
    [key: string]: any;
}
export declare function bindStateToSelector<T>(selector: ISelector, state: Map<any, any>): T;
export declare function bindStateToSelectors(selectors: ISelector | ISelectorHash, state: Map<any, any>): IBoundSelectorHash | any;
