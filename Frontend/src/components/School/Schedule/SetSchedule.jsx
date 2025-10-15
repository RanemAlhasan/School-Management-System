import React, { Component } from "react";
import { getActiveTimes } from "../../../services/generateTableTimes";
import { showClasses, showSubjects } from "../../../services/marksServices";
import PeriodContext from "../../../contexts/periodContext";
import {
  getClassroomsAnnouncements,
  showTeachersInClass,
} from "../../../services/announcementsService";
import Selection from "../../Selection";
import ScheduleTable from "./ScheduleTable";
import {
  getDays,
  getSchoolInfo,
  sendSessions,
} from "../../../services/schoolService";
import { ToastContainer, toast } from "react-toastify";

class SetSchedule extends Component {
  static contextType = PeriodContext;

  state = {
    classes: [],
    classrooms: [],
    teachers: [],
    semesters: [1, 2],
    subjects: [],
    days: [],
    daysWithId: [],

    selectedClass: "",
    selectedClassroom: "",
    selectedSemester: 1,
    selectedDay: "",
    startTime: "",
    breakFrequency: "",
    sessionDuration: "",
    breakDuration: "",

    result: [],
    sessionsNumber: [],
  };

  componentDidMount = async () => {
    let years = this.context.account;

    let {
      activeDays,
      startTime,
      breakFrequency,
      breakDuration,
      sessionDuration,
    } = await getSchoolInfo(years, this.context.siteName);
    let sessionsNumber = activeDays && activeDays.map((element) => "");

    let daysWithId = await getDays();
    let days =
      activeDays &&
      activeDays.map((element) => {
        let name = daysWithId.find((day) => day.id === element).name;
        return name;
      });

    let classes = await showClasses(years, this.context.siteName);
    let selectedClass = classes[0];

    let classrooms = await getClassroomsAnnouncements(
      years,
      selectedClass,
      this.context.siteName
    );
    let selectedClassroom = classrooms[0] ? classrooms[0].classroomId : "";

    let teachers = await showTeachersInClass(
      selectedClass,
      years,
      this.context.siteName
    );

    let subjects = await showSubjects(
      years,
      selectedClass,
      1,
      this.context.siteName
    );

    this.setState({
      classes,
      classrooms,
      subjects,
      selectedClass,
      selectedClassroom,
      teachers,
      sessionsNumber,
      startTime,
      breakFrequency,
      breakDuration,
      sessionDuration,
      days,
      daysWithId,
    });
  };

  handleSelectClass = async (selectedClass) => {
    let years = this.context.account;

    let classrooms = await getClassroomsAnnouncements(
      years,
      selectedClass,
      this.context.siteName
    );
    let selectedClassroom = classrooms[0] ? classrooms[0].classroomId : "";

    let subjects = await showSubjects(
      years,
      selectedClass,
      this.state.selectedSemester,
      this.context.siteName
    );

    let teachers = await showTeachersInClass(
      selectedClass,
      years,
      this.context.siteName
    );

    this.setState({
      classrooms,
      selectedClass,
      selectedClassroom,
      subjects,
      teachers,
    });
  };

  handleSelectClassroom = (selectedClassroom) => {
    let { classrooms } = this.state;
    let id = classrooms.find(
      (element) => element.classroomNumber === selectedClassroom
    ).classroomId;
    this.setState({ selectedClassroom: id });
  };

  handleSelectSemester = async (selectedSemester) => {
    let years = this.context.account;

    let subjects = await showSubjects(
      years,
      this.state.selectedClass,
      selectedSemester,
      this.context.siteName
    );
    this.setState({ selectedSemester, subjects });
  };

  handleSelectSubject = (selectedSubject, selectedTime, day) => {
    let result = [...this.state.result];
    let { subjects } = this.state;
    let subjectId = subjects.find((element) => element.name === selectedSubject)
      .id;
    let [startTime, endTime] = selectedTime.split(" - ");
    let dayId = this.state.daysWithId.find((element) => element.name === day)
      .id;
    let newObj = {
      subjectId,
      teacherId: "",
      dayId,
      startTime,
      endTime,
    };
    let index = result.findIndex(
      (element) =>
        element.dayId === dayId &&
        element.startTime === startTime &&
        element.endTime === endTime
    );

    if (index !== -1) {
      newObj = { ...result[index] };
      newObj["subjectId"] = subjectId;
      result[index] = newObj;
    } else result.push(newObj);

    this.setState({ result });
  };

  handleSelectTeacher = (selectedTeacher, selectedTime, day) => {
    let result = [...this.state.result];
    let { teachers } = this.state;
    let teacherId = teachers.find((element) => element.name === selectedTeacher)
      .id;
    let [startTime, endTime] = selectedTime.split(" - ");
    let dayId = this.state.daysWithId.find((element) => element.name === day)
      .id;

    let newObj = {
      subjectId: "",
      teacherId,
      dayId,
      startTime,
      endTime,
    };
    let index = result.findIndex(
      (element) =>
        element.dayId === dayId &&
        element.startTime === startTime &&
        element.endTime === endTime
    );

    if (index !== -1) {
      newObj = { ...result[index] };
      newObj["teacherId"] = teacherId;
      result[index] = newObj;
    } else result.push(newObj);

    this.setState({ result });
  };

  handleChangeSessionsNumber = ({ currentTarget }, index) => {
    let sessionsNumber = [...this.state.sessionsNumber];
    sessionsNumber[index] = currentTarget.value;
    this.setState({ sessionsNumber });
  };

  handleSendSchedule = async () => {
    let { result, selectedClassroom, sessionsNumber } = this.state;
    let sum = 0;
    for (let i = 0; i < sessionsNumber.length; i++)
      sum += sessionsNumber[i] ? parseInt(sessionsNumber[i]) : 0;
    if (sum === 0) {
      toast.error("Can't set an empty schedule");
      return;
    }
    if (result.length !== sum) {
      toast.error("Please fill the form correctly");
      return;
    }
    try {
      await sendSessions(
        result,
        selectedClassroom,
        this.context.account,
        this.context.siteName
      );
      toast.success("Schedule has been set successfully");
    } catch (error) {
      console.log(error.response.data);
      let msg = "";
      for (let i = 0; i < error.response.data.length; i++) {
        let { day, startTime, endTime } = error.response.data[i];
        msg += `${day} - ${startTime} - ${endTime}, `;
      }
      toast.error(`Teacher is not available at ${msg}`);
      if (error.response.status === 500)
        toast.error("Please fill the form correctly");
    }
  };

  render() {
    let {
      classes,
      semesters,
      classrooms,
      days,
      subjects,
      sessionsNumber,
      startTime,
      breakFrequency,
      breakDuration,
      teachers,
      sessionDuration,
    } = this.state;
    let classroomsNumber = classrooms.map((element) => element.classroomNumber);
    classroomsNumber =
      classroomsNumber.length > 0 ? classroomsNumber : ["None"];
    let subjectsNames = subjects.map((element) => element.name);
    let teachersNames = teachers.map((element) => element.name);

    return (
      <div className="schedule">
        <ToastContainer />
        <div className="selection-container">
          <div className="selection-part">
            <h4>Select a class</h4>
            <Selection data={classes} handleSelect={this.handleSelectClass} />
          </div>
          <div className="selection-part">
            <h4>Select a classroom</h4>
            <Selection
              data={classroomsNumber}
              handleSelect={this.handleSelectClassroom}
            />
          </div>
          <div className="selection-part">
            <h4>Select a semester</h4>
            <Selection
              data={semesters}
              handleSelect={this.handleSelectSemester}
            />
          </div>
        </div>
        <div className="schedule-table">
          {days &&
            days.map((day, index) => (
              <ScheduleTable
                key={index}
                day={day}
                activeTimes={getActiveTimes(
                  startTime,
                  parseInt(breakFrequency),
                  parseInt(sessionsNumber[index]),
                  parseInt(breakDuration),
                  parseInt(sessionDuration)
                )}
                subjectsNames={subjectsNames}
                handleSelectSubject={(subject, time) =>
                  this.handleSelectSubject(subject, time, day)
                }
                handleSelectTeacher={(teacher, time) =>
                  this.handleSelectTeacher(teacher, time, day)
                }
                sessionNumber={
                  sessionsNumber[index] ? sessionsNumber[index] : ""
                }
                handleChangeSessionsNumber={(e) =>
                  this.handleChangeSessionsNumber(e, index)
                }
                teachers={teachersNames}
              />
            ))}
        </div>
        {days && days.length !== 0 && (
          <button onClick={this.handleSendSchedule}>Send</button>
        )}
      </div>
    );
  }
}

export default SetSchedule;
