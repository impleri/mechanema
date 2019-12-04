import * as faker from 'faker';
import * as effects from 'redux-saga/effects';

import {
  createRootEpic,
  registerEpic,
  registerEpics,
  resetRegistry,
} from './aggregator';
import { simpleRoot } from './root-strategies';
import { IEpic } from './types';
import { genericWatcher } from './watcher-strategies';

jest.mock('redux-saga/effects');
jest.mock('./root-strategies');
jest.mock('./watcher-strategies');


const {
  take,
  takeEvery,
  takeLatest,
  takeLeading,
} = effects;

const otherEffects = [take, takeEvery, takeLatest, takeLeading];

describe('pulley aggregator', (): void => {
  beforeEach((): void => {
    jest.resetAllMocks();
    resetRegistry();
  });

  const createEpic = (): IEpic => ({
    on: faker.random.word(),
    call: jest.fn(),
    effect: faker.random.arrayElement(otherEffects),
  });

  const mockWatcher = (): jest.Mock => jest.fn();
  const mockRoot = (callbacks: Function[]): Function[] => callbacks;

  it('handles individual epics', (): void => {
    const epics = Array(faker.random.number({ min: 2, max: 8 })).fill('')
      .map(createEpic);

    (genericWatcher as jest.Mock).mockImplementation(mockWatcher);
    (simpleRoot as jest.Mock).mockImplementation(mockRoot);

    epics.forEach((epic): void => registerEpic(epic));
    const callbacks = createRootEpic(simpleRoot, genericWatcher);

    expect(genericWatcher).toHaveBeenCalledTimes(epics.length);
    epics.forEach((epic, index): void => {
      expect(genericWatcher).toHaveBeenNthCalledWith(index + 1, epic, index, epics);
    });

    expect(simpleRoot).toHaveBeenCalledTimes(1);
    (callbacks as any).forEach((callback: Function): void => {
      expect(jest.isMockFunction(callback)).toBe(true);
    });
  });

  it('handles an array of epics', (): void => {
    const epics = Array(faker.random.number({ min: 2, max: 8 })).fill('')
      .map(createEpic);

    (genericWatcher as jest.Mock).mockImplementation(mockWatcher);
    (simpleRoot as jest.Mock).mockImplementation(mockRoot);

    registerEpics(epics[0]);
    registerEpics(epics.slice(1));

    const callbacks = createRootEpic();

    expect(genericWatcher).toHaveBeenCalledTimes(epics.length);
    epics.forEach((epic, index): void => {
      expect(genericWatcher).toHaveBeenNthCalledWith(index + 1, epic, index, epics);
    });

    expect(simpleRoot).toHaveBeenCalledTimes(1);
    (callbacks as any).forEach((callback: Function): void => {
      expect(jest.isMockFunction(callback)).toBe(true);
    });
  });
});
