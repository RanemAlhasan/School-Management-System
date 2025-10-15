import React from "react";
import { Link } from "react-router-dom";
import Form from "../../Form";
import TeachPeriod from "./TeachPeriod";
import PeriodContext from "../../../contexts/periodContext";

class TeacherDashboard extends Form {
  static contextType = PeriodContext;

  state = {
    active: 0,
    data: [
      "Profile",
      "Weekly Schedule",
      "Marks",
      "Announcements",
      "Homeworks",
      "Scientific Content",
      "Absence",
    ],
    classes: [
      "las la-chalkboard-teacher",
      "las la-chalkboard-teacher",
      "las la-chalkboard-teacher",
      "las la-chalkboard-teacher",
      "las la-chalkboard-teacher",
      "las la-chalkboard-teacher",
      "las la-chalkboard-teacher",
      "las la-chalkboard-teacher",
      "las la-chalkboard-teacher",
    ],
  };

  // School Info

  componentDidMount = () => {
    let type = this.props.type;
    if (type) {
      let active = this.state.data.findIndex(
        (element) =>
          element.toLowerCase().replace(" ", "") === type.toLowerCase()
      );
      this.setState({ active });
    }
  };

  handleClick = (index) => {
    this.setState({ active: index });
  };

  determineClass = (index) => {
    return index === this.state.active ? "active" : "";
  };

  render() {
    return (
      <React.Fragment>
        <h3>
          <i className="las la-home" />
          {this.props.teacherName}
        </h3>
        <div id="inner">
          <TeachPeriod />
          <ul>
            {this.state.data.map((element, index) => (
              <Link
                key={element}
                to={`/teacher/${
                  this.context.account.teacherId
                }/${element.replace(" ", "")}`}
                onClick={() => this.handleClick(index)}
                className={this.determineClass(index)}
              >
                <li>
                  <i className={this.state.classes[index]}></i>
                  <span>{element}</span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

export default TeacherDashboard;
