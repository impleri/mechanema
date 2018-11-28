// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';
import { Collection } from 'immutable';
import bindSelectors, { bindSelector } from './bind-selectors';

function createSelectorConfig() {
  const value = faker.lorem.paragraphs();
  const selector = jest.fn().mockReturnValue(value);

  return {
    key: faker.random.word(),
    selector,
    value,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('bindSelector', () => {
  it('passes state to the selector', () => {
    const mockState = Collection({});
    const selector = createSelectorConfig();

    const receivedValue = bindSelector(selector.selector, mockState);

    expect(receivedValue).toBe(selector.value);
  });
});

describe('bindSelectors', () => {
  it('proxies bindSelector if selectors is a function', () => {
    const mockState = Collection({});
    const selector = createSelectorConfig();

    const receivedValue = bindSelectors(selector.selector, mockState);

    expect(receivedValue).toBe(selector.value);
  });

  it('maps hashmap to bindSelector if selectors is a hashmap', () => {
    const mockState = Collection({});
    const selectors = Array(faker.random.number(10)).fill()
      .map(() => createSelectorConfig());
    const selectorHash = selectors.reduce((aggregator, selector) => {
      const newAggregator = aggregator;

      newAggregator[selector.key] = selector.selector;

      return newAggregator;
    }, {});
    // Add non-function to hash
    selectorHash[faker.random.word()] = faker.lorem.sentence();

    const expectedValue = selectors.reduce((aggregator, selector) => {
      const newAggregator = aggregator;

      newAggregator[selector.key] = selector.value;

      return newAggregator;
    }, {});

    const receivedValue = bindSelectors(selectorHash, mockState);

    expect(receivedValue).toEqual(expectedValue);
  });

  it('throws an error if selectors is not a function or object', () => {
    const mockState = Collection({});

    expect(() => bindSelectors(faker.random.word(), mockState)).toThrow();
  });

  it('throws an error if selectors is null', () => {
    const mockState = Collection({});

    expect(() => bindSelectors(null, mockState)).toThrow();
  });
});
