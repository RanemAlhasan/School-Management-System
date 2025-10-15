import React, { Component } from "react";

class ShowTeachers extends Component {
  getData = (element) => {
    return typeof element === "string" ? [element] : element;
  };

  componentDidMount = () => {};

  render() {
    return (
      <div id="info-container">
        {this.props.info.map((element) => {
          return (
            <div className="info" key={element}>
              <div className="title">
                <i className="fa fa-star" />
              </div>
              <div className="element">
                {this.getData(element).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ShowTeachers;
