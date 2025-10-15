import React from "react";
import { Link } from "react-router-dom";
import Form from "../../Form";
import SchoolPeriod from "./SchoolPeriod";
import PeriodContext from "../../../contexts/periodContext";

class StudentDashboard extends Form {
  static contextType = PeriodContext;

  state = {
    active: 0,
    data: [
      "Profile",
      "Marks",
      "Weekly Schedule",
      "My Teachers",
      "Exam Schedules",
      "Announcements",
      "Homeworks",
      "Scientific Content",
      "Absence",
      "Fees",
      "Complaints",
    ],
    classes: [
      "las la-user-graduate",
      "las la-user-graduate",
      "las la-user-graduate",
      "las la-user-graduate",
      "las la-user-graduate",
      "las la-user-graduate",
      "las la-user-graduate",
      "las la-user-graduate",
      "las la-user-graduate",
      "las la-user-graduate",
      "las la-user-graduate",
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
          {this.props.studentName}
        </h3>
        <div id="inner">
          <SchoolPeriod />
          <ul>
            {this.state.data.map((element, index) => (
              <Link
                key={element}
                to={`/student/${
                  this.context.account.studentId
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

export default StudentDashboard;
