# xstate-redux

A redux middleware for xstate state machine charts.

## What's this for?
xstate is "Simple, stateless JavaScript finite state machines and statecharts". It's API allows for defining your UI as a finite state machine, and then transitioning between states via actions. xstate itself doesn't maintain your application state anywhere - rather, it provides a pure, reducer-like API:

```
f(currentState, action) = nextState
```

So, we've got a stateless lib that has the concept of actions and reducers, but needs a place to store state... sounds like a job for redux!

## How it works

xstate-redux is implemented as a redux middleware. As such, you need to add it to your store when you create it in your app:

```javascript
// example
```

The "chart" in the above example is the xstate statechart corresponding to your UI's finite state machine. The `trafficLight` key is the key under which you'll access this FSM's current state in your redux store.

Transitioning the state requires the use of a specific action type supplied by this library

```javascript
import { transitionState } from 'xstate-redux'

const transition = transitionState('trafficLight')
```
