import { actionCreator } from './actionCreator';
import { TRANSITION_ACTION_TYPE_PREFIX } from './constants';

const event = 'testEvent';
const fullEvent = TRANSITION_ACTION_TYPE_PREFIX + event;

describe('actionCreator', () => {
  it('creates an action with the correct type', () => {
    expect(actionCreator(event)).toEqual({
      type: fullEvent,
      payload: {},
      meta: {}
    });
  });

  it('allows for setting the action payload and meta fields', () => {
    const payload = { foo: 'bar' };
    const meta = { meta: true };

    expect(actionCreator(event, payload, meta)).toEqual({
      type: fullEvent,
      payload,
      meta
    });
  });
});
