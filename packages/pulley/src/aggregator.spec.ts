import * as effects from 'redux-saga/effects';

import {
  IEpic,
  IEpicFunction,
  createRootEpic,
  registerEpic,
  registerEpics,
  resetRegistry,
} from './aggregator';

import faker = require('faker');

jest.mock('redux-saga/effects');

const {
  call,
  spawn,
  take,
  takeEvery,
  takeLatest,
  takeLeading,
} = effects;

const otherEffects = [take, takeEvery, takeLatest, takeLeading];

describe('pulley', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    resetRegistry();
  });

  const createEpic = (): IEpic => ({
    on: faker.random.word(),
    call: jest.fn(),
    effect: faker.random.arrayElement(otherEffects),
  });

  const mockEpicImplementation = (epic: IEpicFunction): IteratorResult<any> => epic().next();

  it('aggregates individual epic definitions', () => {
    const epics = Array(faker.random.number(6)).fill('')
      .map(createEpic);

    (spawn as jest.Mock).mockImplementation(mockEpicImplementation);
    (call as jest.Mock).mockImplementation(mockEpicImplementation);

    epics.forEach(epic => registerEpic(epic));

    const rootEpic = createRootEpic();
    rootEpic().next();

    epics.forEach((epic) => {
      expect(epic.effect).toHaveBeenCalledWith(epic.on, epic.call);
    });

    expect(spawn).toHaveBeenCalledTimes(epics.length);
    expect(call).toHaveBeenCalledTimes(epics.length);
  });

  it('aggregates an array of epic definitions', () => {
    const epics = Array(faker.random.number(6)).fill('')
      .map(createEpic);

    (spawn as jest.Mock).mockImplementation(mockEpicImplementation);
    (call as jest.Mock).mockImplementation(mockEpicImplementation);

    registerEpics(epics);

    const rootEpic = createRootEpic();
    rootEpic().next();

    epics.forEach((epic) => {
      expect(epic.effect).toHaveBeenCalledWith(epic.on, epic.call);
    });

    expect(spawn).toHaveBeenCalledTimes(epics.length);
    expect(call).toHaveBeenCalledTimes(epics.length);
  });

  it('restarts erroroneous epics', () => {
    console.error = jest.fn();
    const epic = createEpic();
    epic.effect = faker.random.arrayElement([
      'take',
      'takeLatest',
      'takeLeading',
    ]);

    const expectedEffect = (effects as any)[epic.effect];
    let mockCount = 0;

    (spawn as jest.Mock).mockImplementation(mockEpicImplementation);
    (call as jest.Mock).mockImplementation(epic => {
      if (mockCount === 0) {
        mockCount++
        throw new Error('Restart');
      }
      mockEpicImplementation(epic);
    });

    registerEpics(epic);

    const rootEpic = createRootEpic();
    const epicGenerator = rootEpic();
    epicGenerator.next();
    epicGenerator.next();

    expect(spawn).toHaveBeenCalledTimes(1);
    expect(call).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(expectedEffect).toHaveBeenCalledTimes(1);
  });
});
