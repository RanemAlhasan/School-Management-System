import React, { Component } from "react";
import { getTeacherDefaultValues } from "../../../services/defaultContextValues";
import PeriodContext from "../../../contexts/periodContext";
import { getTeacherSchedule } from "../../../services/teacherService";
import Selection from "../../Selection";
import TeacherScheduleTable from "./TeacherScheduleTable";

class TeacherSchedule extends Component {
  static contextType = PeriodContext;

  state = {
    schedule: [],
    semesters: [1, 2],
  };

  componentDidMount = async () => {
    let data = await getTeacherDefaultValues(this.context.account);
    let schedule = await getTeacherSchedule(data, 1);
    console.log(schedule);
    this.setState({ schedule });
  };

  handleSelectSemester = async (selectedSemester) => {
    let schedule = await getTeacherSchedule(
      this.context.account,
      selectedSemester
    );
    this.setState({ schedule });
  };

  render() {
    let { schedule, semesters } = this.state;
    return (
      <div className="teacher-selection">
        <h4>Select a semester</h4>
        <Selection data={semesters} handleSelect={this.handleSelectSemester} />
        <TeacherScheduleTable schedule={schedule} />
      </div>
    );
  }
}

export default TeacherSchedule;
