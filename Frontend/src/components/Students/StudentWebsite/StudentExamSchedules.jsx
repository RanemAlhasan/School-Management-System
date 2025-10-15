import React, { Component } from "react";
import { getStudentExamSchedule } from "../../../services/announcementsService";
import PeriodContext from "../../../contexts/periodContext";
import { getDefaultValues } from "../../../services/defaultContextValues";
import ExamScheduleTable from "../../School/Exam Schedule/ExamScheduleTable";
import Selection from "../../Selection";

class StudentExamSchedules extends Component {
  static contextType = PeriodContext;

  state = {
    schedules: [],
    scheduleNumbers: [],

    selectedSchedule: "",
  };

  componentDidMount = async () => {
    let type = this.props.parent ? "parent" : "student";
    let { account } = this.context;
    account = await getDefaultValues(account, type);
    let schedules = await getStudentExamSchedule(account, type);
    let scheduleNumbers = schedules.map((element, index) => index + 1);
    this.setState({
      schedules,
      scheduleNumbers,
      selectedSchedule: scheduleNumbers[0] ? scheduleNumbers[0] : "None",
    });
  };

  handleSelectSchedule = (selectedSchedule) => {
    this.setState({ selectedSchedule });
  };

  render() {
    let { scheduleNumbers, schedules, selectedSchedule } = this.state;

    return (
      <div id="exam-schedule">
        <div className="select-schedule">
          <h4>Select a schedule</h4>
          <Selection
            data={scheduleNumbers}
            handleSelect={this.handleSelectSchedule}
          />
        </div>
        <ExamScheduleTable schedule={schedules[selectedSchedule - 1]} />
      </div>
    );
  }
}

export default StudentExamSchedules;
