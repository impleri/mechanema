import { IEpic, IEpicFunction, IRootStrategy, IWatcherStrategy } from './types';
export declare function createRootEpic(rootStrategy?: IRootStrategy, watcherStrategy?: IWatcherStrategy): IEpicFunction;
export declare function registerEpic(epic: IEpic): void;
export declare function registerEpics(epics: IEpic | IEpic[], ...additionalEpics: IEpic[]): void;
export declare function resetRegistry(): void;
