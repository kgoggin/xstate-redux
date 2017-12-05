# xstate-redux

A reducer enhancer for using an xstate statechart with redux.

## Heads Up!
This is a very early release and the API is subject to change - feedback is very welcome!

## What's this for?
xstate is "Simple, stateless JavaScript finite state machines and statecharts". It's API allows for defining your UI as a finite state machine, and then transitioning between states via actions. xstate itself doesn't maintain your application state anywhere - rather, it provides a pure, reducer-like API:

```
f(currentState, action) = nextState
```

So, we've got a stateless lib that has the concept of actions and reducers, but needs a place to store state... sounds like a job for redux!

## How it works

xstate-redux is implemented as reducer enhancer. That means it wraps an existing redux-style reducer and *enhances* it by tracking the current state of your statechart. It also provides an action creator for transitioning the state to a new one. Let's take a look at how we'd implement xstate's traffic light example using redux to track the state of the light, as well as the total number of cycles the light has completed (Note: this example is also provided as a working app in the `example` folder of the repo!).

### Creating an enhanced reducer

```javascript
import { combineReducers } from 'redux';
import { reducerEnhancer } from 'xstate-redux';
import { Machine } from 'xstate';

// create the xstate machine
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

// create a reducer function to track the number of total cycles the light
// has been through
const trafficLightCycles = (state = initialState, action) => {
	const meta = action.meta || {};

	// the action passed to this reducer has the event that was fired,
	// as well as the value of nextState available on the `meta` field
	if (meta.event === 'TIMER' && meta.nextState === 'green') {
		return { numCycles: state.numCycles + 1 };
	}

	return state;
};

// now we'll enhance our reducer with the state of the machine
export const trafficLight = reducerEnhancer(lightMachine, trafficLightCycles);
```

First, we'll create an xstate machine using the traffic light statechart example. Next, we create a reducer for the part of the traffic light state we want to track outside of the machine - namely, the number of cycles the light has been through. Actions passed to our reducer will be "enhanced" with the type of event that was fired, as well as the value of the new state on the `meta` field. We can use this information to increment the cycle count every time the traffic light goes back to a green light!

Our enhanced reducer returns a state that looks like this:

```javascript
{
	state: 'green' // current state of the machine
	data: {
		numCycles: 0 // data object containing the result of the enhanced reducer
	}
}
```

Enhancing our reducer is done by providing the machine + the reducer function. Now we can include this enhanced reducer alongside any other reducers in our app when we create our redux store:

```javascript
import { combineReducers, createStore } from 'redux';
import { trafficLight } from './trafficLightReducer'

const reducers = combineReducers({
	trafficLight,
	// ..add some other reducers here
});

const store = createStore(reducers, {})
```

Sweet! Now let's build a React component that'll use the current state of the traffic light, as well as its total cycle count:

```javascript
class TrafficLight extends Component {
	render() {
		const { activeColor, numCycles, fireTimer } = this.props;
		return (
			<div>
				{['red', 'yellow', 'green'].map(color => (
					<Light
						color={color}
						key={color}
						active={color === activeColor}
					/>
				))}
				<button onClick={fireTimer}>Fire Timer</button>
				<span>{`Number of cycles: ${numCycles}`}</span>
			</div>
		);
	}
}

// our selector function gets the values we need from the store
const mapStateToProps = state => {
	return {
		numCycles: state.trafficLight.data.numCycles,
		activeColor: state.trafficLight.state
	};
};

// here we're using the actionCreator to create an action that'll
// trigger the 'TIMER' event whenever it's called
const mapDispatchToProps = dispatch => {
	return {
		fireTimer: () => dispatch(actionCreator('TIMER'))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TrafficLight);
```

Woot! Now we've got a component that represents the current state of the light, displays the total number of times the light has fully cycled, and provides a means to fire the 'TIMER' event to transition the state!
