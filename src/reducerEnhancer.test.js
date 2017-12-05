import { Machine } from 'xstate';
import { reducerEnhancer } from './reducerEnhancer';
import { actionCreator } from './actionCreator';

const machine = Machine({
  key: 'light',
  initial: 'green',
  states: {
    green: {
      on: {
        TIMER: 'yellow'
      }
    },
    yellow: {
      on: {
        TIMER: 'red'
      }
    },
    red: {
      on: {
        TIMER: 'green'
      }
    }
  }
});

const testEvent = 'TIMER';

const initialReducerState = { count: 0 };
const reducer = (state = initialReducerState, action) => {
  const meta = action.meta || {};
  if (meta.event === testEvent) {
    return { count: state.count + 1 };
  }

  if (action.type === 'someOtherType') {
    return { count: state.count, someOtherType: true };
  }

  return state;
};

const getMachineWithInitialState = () => {
  const enhancedReducer = reducerEnhancer(machine, reducer);
  const initialState = enhancedReducer(undefined, { type: 'init' });

  return {
    enhancedReducer,
    initialState
  };
};

describe('reducerEnhancer', () => {
  it('sets initial state with the initial state of the machine', () => {
    const { initialState } = getMachineWithInitialState();
    expect(initialState).toEqual({
      state: 'green',
      data: { count: 0 }
    });
  });

  it('can transition the state machine via a dispatched action', () => {
    const { initialState, enhancedReducer } = getMachineWithInitialState();
    const action = actionCreator(testEvent);
    expect(enhancedReducer(initialState, action)).toEqual({
      state: 'yellow',
      data: { count: 1 }
    });
  });
});
