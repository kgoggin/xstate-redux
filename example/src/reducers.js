import { combineReducers } from 'redux';
import { reducerEnhancer } from 'xstate-redux';
import { Machine } from 'xstate';

const lightMachine = Machine({
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

const initialState = { numCycles: 0 };

const trafficLightCycles = (state = initialState, action) => {
	const meta = action.meta || {};
	if (meta.event === 'TIMER' && meta.nextState === 'green') {
		return { numCycles: state.numCycles + 1 };
	}

	return state;
};

const trafficLight = reducerEnhancer(lightMachine, trafficLightCycles);

export default combineReducers({ trafficLight });
