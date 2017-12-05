import React, { Component } from 'react';
import { Provider } from 'react-redux';

import TrafficLight from './TrafficLight';
import createStore from './store';

const store = createStore();

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<TrafficLight />
			</Provider>
		);
	}
}

export default App;
