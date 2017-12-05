import { TRANSITION_ACTION_TYPE_PREFIX } from './constants';

const augmentAction = (prevState, nextState, event, action) => {
	return {
		...action,
		meta: {
			...action.meta,
			prevState,
			nextState,
			event
		}
	};
};

export const reducerEnhancer = (machine, reducer) => {
	const initialState = {
		state: machine.getInitialState(),
		data: reducer(undefined, {})
	};

	return (state = initialState, action) => {
		const { state: current } = state;
		if (action.type.indexOf(TRANSITION_ACTION_TYPE_PREFIX) !== 0) {
			return {
				state: current,
				data: reducer(
					state.data,
					augmentAction(current, current, null, action)
				)
			};
		}

		const event = action.type.slice(TRANSITION_ACTION_TYPE_PREFIX.length);
		const nextState = machine.transition(current, event).value;

		return {
			state: nextState,
			data: reducer(
				state.data,
				augmentAction(current, nextState, event, action)
			)
		};
	};
};
