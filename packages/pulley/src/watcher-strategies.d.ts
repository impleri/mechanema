import * as effects from 'redux-saga/effects';
import { IEpic, IEpicFunction } from './types';
export declare function genericWatcher(epic: IEpic): IEpicFunction<effects.Effect>;
