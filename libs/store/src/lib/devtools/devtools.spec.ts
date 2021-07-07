import { addEntities } from '../entities';
import { createEntitiesStore, createTodo } from '../mocks/stores.mock';
import { devTools } from './index';

describe('devtools', () => {
  const instanceMock = {
    init: jest.fn(),
    subscribe: jest.fn(),
    send: jest.fn(),
  };

  Object.defineProperty(global, 'window', {
    value: {
      __REDUX_DEVTOOLS_EXTENSION__: {
        connect: jest.fn().mockImplementation(() => instanceMock),
      },
    },
  });

  devTools();

  it('should send actions', () => {
    const store = createEntitiesStore();

    expect(instanceMock.send).toHaveBeenCalledWith(
      { type: '[Todos] - @Init' },
      {
        todos: {
          entities: {},
          ids: [],
        },
      }
    );

    store.reduce(addEntities(createTodo(1)));

    expect(instanceMock.send).toHaveBeenCalledWith(
      { type: '[Todos] - Update' },
      {
        todos: {
          entities: {
            1: {
              completed: false,
              id: 1,
              title: 'todo 1',
            },
          },
          ids: [1],
        },
      }
    );

    store.destroy();

    expect(instanceMock.send).toHaveBeenCalledWith(
      { type: 'Remove Todos' },
      {}
    );

    createEntitiesStore('foo');

    expect(instanceMock.send).toHaveBeenCalledWith(
      { type: '[Foo] - @Init' },
      {
        foo: {
          entities: {},
          ids: [],
        },
      }
    );

    const bar = createEntitiesStore('bar');

    expect(instanceMock.send).toHaveBeenCalledWith(
      { type: '[Bar] - @Init' },
      {
        foo: {
          entities: {},
          ids: [],
        },
        bar: {
          entities: {},
          ids: [],
        },
      }
    );

    bar.reduce(addEntities(createTodo(1)));

    expect(instanceMock.send).toHaveBeenCalledWith(
        { type: '[Bar] - Update' },
      {
        foo: {
          entities: {},
          ids: [],
        },
        bar: {
          entities: {
            1: {
              completed: false,
              id: 1,
              title: 'todo 1',
            },
          },
          ids: [1],
        },
      }
    );
  });
});
