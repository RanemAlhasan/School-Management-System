import React, { Component } from "react";
import PeriodContext from "../contexts/periodContext";

class Selection extends Component {
  static contextType = PeriodContext;

  state = {
    checked: false,
    heading: "",
  };

  getHeading = () => {
    if (this.state.heading) return this.state.heading;
    if (this.props.heading) return this.props.heading;
    else return this.props.data.length !== 0 ? this.props.data[0] : "None";
  };

  handleClick = () => {
    let checked = this.state.checked;
    this.setState({ checked: !checked });
  };

  handleSelect = (element, index) => {
    this.setState({ checked: false, heading: element });
    if (this.props.handleSelect) {
      this.props.handleSelect(element, index);
    }
  };

  render() {
    return (
      <div className="select">
        <div className="title" onClick={this.handleClick}>
          <span>{this.getHeading()}</span>
          <i className="las la-caret-down" />
        </div>
        {this.state.checked && (
          <div className="options">
            {this.props.data.map((element, index) => (
              <div
                key={index}
                onClick={() => this.handleSelect(element, index)}
              >
                {element}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Selection;
