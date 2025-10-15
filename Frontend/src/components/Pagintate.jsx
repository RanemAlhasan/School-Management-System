import React, { Component } from "react";

class Paginate extends Component {
  state = {
    items: [],
    active: 0,
  };

  componentDidMount = () => {
    let number = this.props.number;
    let numericArray = [];
    for (let i = 1; i <= number; i++) numericArray.push(i);
    this.setState({ items: numericArray });
  };

  handleClick = (index) => {
    this.props.handleClick(index);
  };

  determineClass = (index) => {
    return index === this.props.active ? "active" : "";
  };

  render() {
    return (
      <ul className="paginate">
        {this.state.items.map((item, index) => (
          <li
            key={item}
            className={this.determineClass(index)}
            onClick={() => this.handleClick(index)}
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }
}

export default Paginate;
