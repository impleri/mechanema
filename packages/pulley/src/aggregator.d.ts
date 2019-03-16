export interface IEpic {
    effect: Function | string;
    on: string;
    call: Function;
}
export interface IEpicFunction {
    (): Iterator<void>;
}
export declare function createRootEpic(): IEpicFunction;
export declare function registerEpic(epic: IEpic): void;
export declare function registerEpics(epics: IEpic | IEpic[], ...additionalEpics: IEpic[]): void;
export declare function resetRegistry(): void;
