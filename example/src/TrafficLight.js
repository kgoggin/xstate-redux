import React, { Component } from 'react';
import glamorous from 'glamorous';
import { connect } from 'react-redux';
import { actionCreator } from 'xstate-redux';

const Light = glamorous.div(
	{
		borderRadius: '50%',
		height: '50px',
		width: '50px'
	},
	({ color, active }) => ({
		backgroundColor: color,
		opacity: active ? 1 : 0.5
	})
);

const Wrapper = glamorous.div({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	width: '150px',
	margin: '50px auto',
	justifyContent: 'space-between',
	' > * ': {
		marginBottom: '10px'
	}
});

const Trigger = glamorous.button({});

class TrafficLight extends Component {
	render() {
		const { activeColor, numCycles, fireTimer } = this.props;
		return (
			<Wrapper>
				{['red', 'yellow', 'green'].map(color => (
					<Light
						color={color}
						key={color}
						active={color === activeColor}
					/>
				))}
				<Trigger onClick={fireTimer}>Fire Timer</Trigger>
				<span>{`Number of cycles: ${numCycles}`}</span>
			</Wrapper>
		);
	}
}

const mapStateToProps = state => {
	return {
		numCycles: state.trafficLight.data.numCycles,
		activeColor: state.trafficLight.state
	};
};

const mapDispatchToProps = dispatch => {
	return {
		fireTimer: () => dispatch(actionCreator('TIMER'))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TrafficLight);
