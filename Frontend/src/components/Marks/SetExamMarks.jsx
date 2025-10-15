import React from "react";
import Selection from "../Selection";
import PeriodContext from "../../contexts/periodContext";
import Form from "../Form";
import SetStudentsMark from "./SetStudentsMark";
import StudentContext from "../../contexts/studentContext";
import {
  sendStudentsExamMark,
  showClasses,
  showClassrooms,
  showStudents,
} from "../../services/marksServices";
import { ToastContainer, toast } from "react-toastify";
import { replaceEverything } from "../../services/dateCompare";
import { getExamSchedule } from "../../services/announcementsService";

class SetExamMarks extends Form {
  static contextType = PeriodContext;

  state = {
    classes: [],
    classroomsNumber: [],
    schedules: [],
    students: [],

    selectedClass: "",
    selectedClassroom: "",
    selectedSchedule: "",

    fullMark: "",
    examDate: "",
  };

  componentDidMount = async () => {
    // Year
    let years = this.context.account;

    // Classes
    let classes = await showClasses(years, this.context.siteName);
    let selectedClass = classes[0];

    // Classrooms
    let classroomsNumber = await showClassrooms(
      years,
      selectedClass,
      this.context.siteName
    );
    let selectedClassroom = classroomsNumber[0];

    // Exams
    let schedules = await getExamSchedule(
      years,
      this.context.siteName,
      selectedClass,
      selectedClassroom
    );
    let newSchedules = [];
    for (let i = 0; i < schedules.length; i++) {
      for (let j = 0; j < schedules[i].length; j++) {
        newSchedules.push({
          name: `${schedules[i][j].date} - ${schedules[i][j].subject}`,
          id: schedules[i][j].id,
        });
      }
    }

    let selectedSchedule = newSchedules[0] ? newSchedules[0].id : "";

    // Students
    let students = await showStudents(
      years,
      selectedClass,
      selectedClassroom,
      this.context.siteName
    );
    students = this.mapStudentsArray(students);

    // Set the state
    this.setState({
      classes,
      classroomsNumber,
      schedules: newSchedules,
      students,
      selectedClass,
      selectedClassroom: selectedClassroom ? selectedClassroom : "None",
      selectedSchedule,
    });
  };

  // Handle Selection

  handleSelectClass = async (selectedClass) => {
    // Year
    let years = this.context.account;

    // Classrooms
    let classroomsNumber = await showClassrooms(
      years,
      selectedClass,
      this.context.siteName
    );
    let selectedClassroom = classroomsNumber[0];

    let students = await showStudents(
      years,
      selectedClass,
      selectedClassroom,
      this.context.siteName
    );
    students = this.mapStudentsArray(students);

    // Exams
    let schedules = await getExamSchedule(
      years,
      this.context.siteName,
      selectedClass,
      selectedClassroom
    );
    let newSchedules = [];
    for (let i = 0; i < schedules.length; i++) {
      for (let j = 0; j < schedules[i].length; j++) {
        newSchedules.push({
          name: `${schedules[i][j].date} - ${schedules[i][j].subject}`,
          id: schedules[i][j].id,
        });
      }
    }

    let selectedSchedule = newSchedules[0] ? newSchedules[0].id : "";

    this.setState({
      classroomsNumber,
      selectedClass,
      selectedClassroom: selectedClassroom ? selectedClassroom : "None",
      students,
      schedules: newSchedules,
      selectedSchedule,
    });
  };

  handleSelectClassrooms = async (element) => {
    let students = await showStudents(
      this.context.account,
      this.state.selectedClass,
      element,
      this.context.siteName
    );
    students = this.mapStudentsArray(students);

    // Exams
    let schedules = await getExamSchedule(
      this.context.account,
      this.context.siteName,
      this.state.selectedClass,
      element
    );
    let newSchedules = [];
    for (let i = 0; i < schedules.length; i++) {
      for (let j = 0; j < schedules[i].length; j++) {
        newSchedules.push({
          name: `${schedules[i][j].date} - ${schedules[i][j].subject}`,
          id: schedules[i][j].id,
        });
      }
    }

    let selectedSchedule = newSchedules[0] ? newSchedules[0].id : "";

    this.setState({
      selectedClassroom: element,
      students,
      schedules: newSchedules,
      selectedSchedule,
    });
  };

  // Handle Full Mark Change

  changeFullMark = ({ currentTarget }) => {
    this.setState({ fullMark: currentTarget.value });
  };

  // Handle Student Mark Change

  changeStdMark = ({ currentTarget }) => {
    let { name, value } = currentTarget;
    let students = [...this.state.students];
    let index = students.findIndex(
      (element) => parseInt(element.id) === parseInt(name)
    );
    let student = students.find(
      (element) => parseInt(element.id) === parseInt(name)
    );

    students[index] = {
      name: student.name,
      id: student.id,
      mark: parseInt(value),
    };
    this.setState({ students });
  };

  // Handle Select Schedule
  handleSelectSchedule = (selectedSchedule, index) => {
    let { schedules } = this.state;
    selectedSchedule = schedules[index].id;
    this.setState({ selectedSchedule });
  };

  // Handle Send Marks
  handleSendMarks = async () => {
    let years = this.context.account;
    let {
      fullMark,
      students,
      selectedClass,
      selectedClassroom,
      selectedSchedule,
    } = this.state;

    if (fullMark <= 0) {
      toast.error("Set a valid full mark");
      return;
    }
    let errors = [];
    for (let { name, mark } of students) {
      if (mark < 0 || mark > fullMark) {
        errors.push(name);
      }
    }
    if (errors.length) {
      let errorMessage = `set a valid mark for ${replaceEverything(
        errors,
        ",",
        ", "
      )}`;
      toast.error(errorMessage);
    } else {
      try {
        await sendStudentsExamMark(
          years,
          selectedClass,
          selectedClassroom,
          fullMark,
          students,
          this.context.siteName,
          selectedSchedule
        );
        toast.success("Marks have been added successfully");
      } catch (error) {}
    }
  };

  // Map Students Array
  mapStudentsArray = (students) => {
    students = students.map((student) => ({
      name: student.name,
      mark: "",
      id: student.id,
    }));
    return students;
  };

  render() {
    let {
      fullMark,
      students,
      classroomsNumber,
      classes,
      schedules,
    } = this.state;

    schedules = schedules.map((element) => element.name);

    return (
      <React.Fragment>
        <ToastContainer />
        <StudentContext.Provider
          value={{
            students,
            fullMark,
            handleSendMarks: this.handleSendMarks,
            handleFullMarkChange: this.changeFullMark,
            handleStdMarkChange: this.changeStdMark,
          }}
        >
          <div id="selection-container">
            <div className="selection-part">
              <h4>Select a class</h4>
              <Selection data={classes} handleSelect={this.handleSelectClass} />
            </div>

            <div className="selection-part">
              <h4>Select a classroom</h4>
              <Selection
                data={classroomsNumber}
                handleSelect={this.handleSelectClassrooms}
              />
            </div>
            <div className="selection-part">
              <h4>Select an exam</h4>
              <Selection
                data={schedules}
                handleSelect={this.handleSelectSchedule}
              />
            </div>
          </div>
          {students.length ? (
            <SetStudentsMark />
          ) : (
            <h2
              style={{
                marginLeft: "10px",
                color: "#e74c3c",

                marginTop: "30px",
                textAlign: "center",
              }}
            >
              No students to show
            </h2>
          )}
        </StudentContext.Provider>
      </React.Fragment>
    );
  }
}

export default SetExamMarks;
