import * as React from 'react'

export default class Layout extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <img src={require("img/react.png")} width="100"/>
        {this.props.children}
      </div>
    )
  }
}