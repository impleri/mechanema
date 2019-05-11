import { CallEffect, Effect, ForkEffect } from 'redux-saga/effects';
import { IEpicFunction, SimpleStrategyEffect } from './types';
export declare function createEpicSpawn(epic: IEpicFunction): IEpicFunction<CallEffect>;
export declare function spawnMapper(epic: IEpicFunction): ForkEffect;
export declare function spawnRoot(epicMethods: IEpicFunction[]): IEpicFunction<ForkEffect>;
export declare function simpleMapper(epic: IEpicFunction<Effect>): Iterator<Effect>;
export declare function simpleRoot(epicMethods: IEpicFunction<Effect>[]): IEpicFunction<SimpleStrategyEffect>;
