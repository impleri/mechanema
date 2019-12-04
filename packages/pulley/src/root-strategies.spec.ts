import * as faker from 'faker';
import {
  all,
  call,
  Effect,
  spawn as spawnEffect,
} from 'redux-saga/effects';
import {
  createEpicSpawn,
  simpleMapper,
  simpleRoot,
  spawnMapper,
  spawnRoot,
} from './root-strategies';
import { IEpicFunction } from './types';

jest.mock('redux-saga/effects');

describe('pulley root strategies', (): void => {
  describe('spawn strategy', (): void => {
    beforeEach((): void => {
      jest.resetAllMocks();
    });

    it('creates a spawn from epic', (): void => {
      const mockEpic = jest.fn();
      const epicSpawn = createEpicSpawn(mockEpic)();
      epicSpawn.next();
      epicSpawn.next();

      expect(call).toHaveBeenCalledWith(mockEpic);
    });

    it('maps epics to spawns', (): void => {
      const mockEpic = jest.fn();
      spawnMapper(mockEpic);

      expect(spawnEffect).toHaveBeenCalled();
    });

    it('spawns all epics', (): void => {
      const arraySize = faker.random.number({ min: 2, max: 8 });
      const responses = Array(arraySize)
        .fill('')
        .map((): string => faker.lorem.sentence());

      responses.forEach(
        (response: string): jest.Mock => (spawnEffect as jest.Mock).mockReturnValueOnce(response),
      );

      const mockEpics: IEpicFunction<Effect>[] = Array(arraySize)
        .fill('')
        .map((unused, index): jest.Mock => jest.fn().mockReturnValue(responses[index]));

      const epicGenerator = spawnRoot(mockEpics)();
      let iteration = epicGenerator.next();
      while (!iteration.done) {
        expect(responses).toEqual(expect.arrayContaining([iteration.value]));
        iteration = epicGenerator.next();
      }
    });
  });

  describe('simple strategy', (): void => {
    beforeEach((): void => {
      jest.resetAllMocks();
    });

    it('starts a watcher', (): void => {
      const mockEpic = jest.fn();
      simpleMapper(mockEpic);

      expect(mockEpic).toHaveBeenCalled();
    });

    it('starts all watchers', (): void => {
      const arraySize = faker.random.number({ min: 2, max: 8 });
      const responses = Array(arraySize)
        .fill('')
        .map((): string => faker.lorem.sentence());
      const mockEpics: IEpicFunction<Effect>[] = Array(arraySize)
        .fill('')
        .map((unused, index): jest.Mock => jest.fn().mockReturnValue(responses[index]));

      const rootEpic = simpleRoot(mockEpics);
      rootEpic().next();

      expect(all).toHaveBeenCalledWith(responses);
    });
  });
});
