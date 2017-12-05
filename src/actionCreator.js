import { TRANSITION_ACTION_TYPE_PREFIX } from './constants';

export const actionCreator = (event, payload = {}, meta = {}) => {
  return {
    type: `${TRANSITION_ACTION_TYPE_PREFIX}${event}`,
    payload,
    meta
  };
};
