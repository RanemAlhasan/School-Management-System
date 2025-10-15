import React, { Component } from "react";
import {
  getSiteName,
  getStudentSchedule,
} from "../../../services/studentService";
import PeriodContext from "../../../contexts/periodContext";
import Selection from "../../Selection";
import Schedule from "./Schedule";

class StudentSchedule extends Component {
  static contextType = PeriodContext;

  state = {
    schedule: [],
    semesters: [1, 2],

    selectedSemester: "",
  };

  componentDidMount = async () => {
    let type = this.props.parent ? "parent" : "student";
    let selectedSemester = 1;
    let siteName = "";
    if (!this.context.account.startYear) {
      siteName = await getSiteName(this.context.account, type);
      siteName = siteName[0];
    } else siteName = this.context.account.siteName;

    let schedule = await getStudentSchedule(
      this.context.account,
      siteName,
      selectedSemester,
      type
    );
    this.setState({ selectedSemester, schedule });
  };

  handleSelectSemester = async (selectedSemester) => {
    let siteName = this.context.account.siteName;
    let type = this.props.parent ? "parent" : "student";
    let schedule = await getStudentSchedule(
      this.context.account,
      siteName,
      selectedSemester,
      type
    );
    this.setState({ selectedSemester, schedule });
  };

  render() {
    let { semesters, schedule } = this.state;
    return (
      <div className="common-schedule">
        <h4 className="semester">Select a semester</h4>
        <Selection data={semesters} handleSelect={this.handleSelectSemester} />
        <div className="common-schedule-table">
          <Schedule schedule={schedule} />
        </div>
      </div>
    );
  }
}

export default StudentSchedule;
