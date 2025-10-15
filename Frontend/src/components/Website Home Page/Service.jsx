import React, { Component } from "react";

class Service extends Component {
  state = {};
  render() {
    let { iconClass, heading, body } = this.props.element;
    return (
      <div className="service">
        <i className={`${iconClass}`} />
        <h2>{heading}</h2>
        <p>{body}</p>
      </div>
    );
  }
}

export default Service;
