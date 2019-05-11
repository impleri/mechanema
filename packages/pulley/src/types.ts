import { AllEffect, Effect } from 'redux-saga/effects';

export interface IEpic {
  effect: Function | string;
  on: string;
  call: Function;
}

export interface IEpicFunction<T=any> {
  (): Iterator<T>;
}

export type SimpleStrategyEffect = AllEffect<Iterator<Effect>>

export interface IRootStrategy {
  (epicMethods: IEpicFunction<Effect>[]): IEpicFunction<SimpleStrategyEffect>;
}

export interface IWatcherStrategy {
  (epic: IEpic): IEpicFunction<Effect>;
}
