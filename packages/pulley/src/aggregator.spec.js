// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';
import * as effects from 'redux-saga/effects';
import { createRootEpic, registerEpics } from './aggregator';

jest.mock('redux-saga/effects');
const { all, takeEvery, ...otherEffects } = effects;

describe('pulley', () => {
  const createEpic = () => ({
    on: faker.random.word(),
    call: jest.fn(),
  });

  it('aggregates individual epic definitions', () => {
    const epics = Array(faker.random.number(6)).fill()
      .map(() => createEpic());

    const mockAllReturn = faker.lorem.paragraph();
    all.mockImplementation((receivedArray) => {
      receivedArray.forEach(epic => epic.next());
      return mockAllReturn;
    });

    epics.forEach(epic => registerEpics(epic));

    const rootEpic = createRootEpic();
    const givenAllValue = rootEpic().next().value;

    expect(all).toHaveBeenCalledWith(expect.any(Array));
    expect(givenAllValue).toBe(mockAllReturn);

    epics.forEach((epic) => {
      expect(takeEvery).toHaveBeenCalledWith(epic.on, epic.call);
    });
  });

  it('aggregates an array of epic definitions', () => {
    const generalEpics = Array(faker.random.number(5)).fill()
      .map(() => createEpic());
    const stringEpic = createEpic();
    stringEpic.effect = faker.random.arrayElement(Object.keys(otherEffects));

    const badEpic = createEpic();
    badEpic.effect = faker.random.word();

    const epics = [stringEpic, badEpic].concat(generalEpics);

    const mockAllReturn = faker.lorem.paragraph();
    all.mockImplementation((receivedArray) => {
      receivedArray.forEach(epic => epic.next());
      return mockAllReturn;
    });

    registerEpics(epics);

    const rootEpic = createRootEpic();
    const givenAllValue = rootEpic().next().value;

    expect(all).toHaveBeenCalledWith(expect.any(Array));
    expect(givenAllValue).toBe(mockAllReturn);

    epics.forEach((epic, index) => {
      if (index === 0) {
        const realEffect = otherEffects[epic.effect];
        expect(realEffect).toHaveBeenCalledWith(epic.on, epic.call);
        return;
      }
      expect(takeEvery).toHaveBeenCalledWith(epic.on, epic.call);
    });
  });
});
