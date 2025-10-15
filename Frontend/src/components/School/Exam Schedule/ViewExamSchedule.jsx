import React, { Component } from "react";
import {
  getClassroomsAnnouncements,
  getExamSchedule,
} from "../../../services/announcementsService";
import { showClasses } from "../../../services/marksServices";
import Selection from "../../Selection";
import PeriodContext from "../../../contexts/periodContext";
import ExamScheduleTable from "./ExamScheduleTable";

class ViewExamSchedule extends Component {
  static contextType = PeriodContext;

  state = {
    classes: [],
    classrooms: [],
    classroomsNumber: [],
    schedules: [],
    scheduleNumbers: [],

    selectedClass: "",
    selectedClassroom: "",
    selectedSchedule: "",
  };

  componentDidMount = async () => {
    // Year
    let years = this.context.account;
    let siteName = this.context.siteName;

    // Classes
    let classes = await showClasses(years, this.context.siteName);
    let selectedClass = classes[0];

    // Classrooms
    let classrooms = await getClassroomsAnnouncements(
      years,
      selectedClass,
      this.context.siteName
    );
    let classroomsNumber = classrooms.map((element) => element.classroomNumber);
    let selectedClassroom = classroomsNumber[0];

    let schedules = await getExamSchedule(
      years,
      siteName,
      selectedClass,
      selectedClassroom
    );

    let scheduleNumbers = schedules.map((schedule, index) => index + 1);

    // Set the state
    this.setState({
      classes,
      classrooms,
      classroomsNumber,
      selectedClass,
      scheduleNumbers,
      schedules,
      selectedSchedule: scheduleNumbers[0] ? scheduleNumbers[0] : "None",
      selectedClassroom: selectedClassroom ? selectedClassroom : "None",
    });
  };

  handleSelectClass = async (selectedClass) => {
    // Year
    let years = this.context.account;

    // Classrooms
    let classrooms = await getClassroomsAnnouncements(
      years,
      selectedClass,
      this.context.siteName
    );
    let classroomsNumber = classrooms.map((element) => element.classroomNumber);
    let selectedClassroom = classroomsNumber[0];

    let schedules = await getExamSchedule(
      years,
      this.context.siteName,
      selectedClass,
      selectedClassroom
    );

    let scheduleNumbers = schedules.map((schedule, index) => index + 1);

    this.setState({
      classrooms,
      classroomsNumber,
      selectedClass,
      scheduleNumbers,
      schedules,
      selectedSchedule: scheduleNumbers[0] ? scheduleNumbers[0] : "None",
      selectedClassroom: selectedClassroom ? selectedClassroom : "None",
    });
  };

  handleSelectClassroom = async (selectedClassroom) => {
    let schedules = await getExamSchedule(
      this.context.account,
      this.context.siteName,
      this.state.selectedClass,
      selectedClassroom
    );

    let scheduleNumbers = schedules.map((schedule, index) => index + 1);

    this.setState({
      selectedClassroom,
      scheduleNumbers,
      schedules,
      selectedSchedule: scheduleNumbers[0] ? scheduleNumbers[0] : "None",
    });
  };

  handleSelectSchedule = (selectedSchedule) => {
    this.setState({ selectedSchedule });
  };

  render() {
    let {
      classes,
      classroomsNumber,
      selectedClassroom,
      schedules,
      scheduleNumbers,
      selectedSchedule,
    } = this.state;

    return (
      <div id="exam-schedule">
        <div id="selection-container">
          <div className="selection-part">
            <h4>Select a class</h4>
            <Selection data={classes} handleSelect={this.handleSelectClass} />
          </div>

          <div className="selection-part">
            <h4>Select a classroom</h4>
            <Selection
              data={classroomsNumber}
              handleSelect={this.handleSelectClassroom}
              heading={selectedClassroom}
            />
          </div>
          <div className="selection-part">
            <h4>Select a schedule</h4>
            <Selection
              data={scheduleNumbers}
              heading={selectedSchedule}
              handleSelect={this.handleSelectSchedule}
            />
          </div>
        </div>
        <ExamScheduleTable schedule={schedules[selectedSchedule - 1]} />
      </div>
    );
  }
}

export default ViewExamSchedule;
