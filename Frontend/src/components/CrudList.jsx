import React, { Component } from "react";
import { Link } from "react-router-dom";
import { replaceEverything } from "../services/dateCompare";

class CrudList extends Component {
  state = {
    selected: 0,
  };

  componentDidMount = () => {
    let type = this.props.type;
    if (type) {
      let typeIndex = this.props.list.findIndex(
        (element) =>
          replaceEverything(element.toLowerCase(), " ", "") ===
          type.toLowerCase()
      );
      this.setState({ selected: typeIndex === -1 ? 0 : typeIndex });
    }
  };

  handleClick = (index, element) => {
    this.setState({ selected: index });
    if (this.props.customClick) this.props.customClick(element);
  };

  render() {
    return (
      <ul className="crud">
        {this.props.list.map((element, index) => (
          <Link
            to={`${this.props.baseURL}/${replaceEverything(element, " ", "")}`}
            key={element}
          >
            <li
              onClick={() => this.handleClick(index, element)}
              className={this.state.selected === index ? "active" : ""}
            >
              {element}
            </li>
          </Link>
        ))}
      </ul>
    );
  }
}

export default CrudList;
