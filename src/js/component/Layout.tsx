import * as React from 'react'

export default class Layout extends React.Component<{}, {}> {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <h1>Hello, world!</h1>
            <img src={require("img/react.png")} width="100"/>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}