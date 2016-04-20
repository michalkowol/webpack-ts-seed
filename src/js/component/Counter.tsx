import * as React from 'react'

interface CounterState {
  counter: number
}

export default class Counter extends React.Component<{}, CounterState> {
  
  interval: any;

  constructor(props) {
    super(props);
    this.state = { counter: 0 };
  }

  componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 1000);
  }

  tick() {
    console.log(this.state);
    this.setState({
      counter: this.state.counter + 1
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <h2>Counter: {this.state.counter}</h2>
   );
  }
}

