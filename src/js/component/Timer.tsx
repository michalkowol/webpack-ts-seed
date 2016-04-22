import * as React from 'react'

interface TimerState {
  counter: number
}

export default class Timer extends React.Component<{}, TimerState> {
  
  interval: any;

  constructor(props) {
    super(props);
    this.state = { counter: 0 };
  }

  componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 1000);
  }

  tick() {
    this.setState({
      counter: this.state.counter + 1
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <h2>Timer: {this.state.counter}</h2>
   );
  }
}

