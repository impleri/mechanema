import { Collection } from 'immutable';
import { ISelector } from './selector';
declare type MachineState = string | symbol;
declare type NamespaceId = string | symbol;
export declare function getStateSelector<StoreState extends Collection<any, any>, SliceShape extends object = {}>(namespace: NamespaceId, stateKey?: string, initState?: string): ISelector<MachineState, StoreState>;
export {};
