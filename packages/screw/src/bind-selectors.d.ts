import { Collection } from 'immutable';
import { ISelector } from './selector';
export interface ISelectorHash {
    [key: string]: ISelector;
}
export interface IBoundSelectorHash {
    [key: string]: any;
}
export declare function bindStateToSelector<T extends IBoundSelectorHash, S extends Collection<any, any>>(selector: ISelector<T, S>, state: S): T;
export declare function bindStateToSelectors<T extends IBoundSelectorHash, S extends Collection<any, any>>(selectors: ISelector<T, S> | ISelectorHash, state: S): T;
