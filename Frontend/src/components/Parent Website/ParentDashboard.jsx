import React from "react";
import { Link } from "react-router-dom";
import SchoolPeriod from "../Students/StudentWebsite/SchoolPeriod";
import PeriodContext from "../../contexts/periodContext";
import Form from "../Form";

class ParentDashboard extends Form {
  static contextType = PeriodContext;

  state = {
    active: 0,
    data: [
      "Marks",
      "Weekly Schedule",
      "Teachers",
      "Exam Schedules",
      "Announcements",
      "Homeworks",
      "Scientific Content",
      "Absence",
      "Fees",
    ],
    classes: [
      "las la-school",
      "las la-school",
      "las la-school",
      "las la-school",
      "las la-school",
      "las la-school",
      "las la-school",
      "las la-school",
      "las la-school",
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
          <SchoolPeriod parent={true} />
          <ul>
            {this.state.data.map((element, index) => (
              <Link
                key={element}
                to={`/parent/${this.context.account.parentId}/${
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

export default ParentDashboard;
