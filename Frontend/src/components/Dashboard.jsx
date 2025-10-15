import React from "react";
import { Link } from "react-router-dom";
import Form from "./Form";
import SchoolPeriod from "./SchoolPeriod";
import PeriodContext from "../contexts/periodContext";

class Dashboard extends Form {
  static contextType = PeriodContext;

  state = {
    active: 0,
    data: [
      "School Info",
      "Classes",
      "Classroom",
      "Subject",
      "Students",
      "Sort Students",
      "Teachers",
      "Teacher's Info",
      "Weekly Schedule",
      "Marks",
      "Marks Report",
      "Absence",
      "Exam Schedule",
      "Announcements",
      "Homeworks",
      "Scientific Content",
      "Complaints",
      "Fees",
      "School Content",
      "Test",
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
      "las la-school",
      "las la-school",
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
    let { siteName } = this.context;
    return (
      <React.Fragment>
        <h3>
          <i className="las la-home" />
          {siteName}
        </h3>
        <div id="inner">
          <SchoolPeriod />
          <ul>
            {this.state.data.map((element, index) => (
              <Link
                key={element}
                to={`/school/${siteName}/${element.replace(" ", "")}`}
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

export default Dashboard;
