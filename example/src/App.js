import React, { Component } from 'react';
import glamorous from 'glamorous';

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

class App extends Component {
  render() {
    const { activeColor } = this.props;
    return (
      <Wrapper>
        {['red', 'yellow', 'green'].map(color => (
          <Light color={color} key={color} active={color === activeColor} />
        ))}
        <Trigger>Fire Timer</Trigger>
      </Wrapper>
    );
  }
}

export default App;
