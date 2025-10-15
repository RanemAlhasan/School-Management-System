import React from "react";
import Selection from "../Selection";
import PeriodContext from "../../contexts/periodContext";
import Form from "../Form";
import SetStudentsMark from "./SetStudentsMark";
import StudentContext from "../../contexts/studentContext";
import {
  getExamType,
  sendStudentsMark,
  showClasses,
  showClassrooms,
  showStudents,
  showSubjects,
} from "../../services/marksServices";
import { ToastContainer, toast } from "react-toastify";
import { dateCompare, replaceEverything } from "../../services/dateCompare";

class SetMarks extends Form {
  static contextType = PeriodContext;

  state = {
    classes: [],
    classroomsNumber: [],
    semesters: [1, 2],
    examTypes: [],
    examTypesName: [],
    subjects: [],
    subjectsName: [],
    students: [],

    selectedClass: "",
    selectedClassroom: "",
    selectedSemester: "",
    selectedExamType: "",
    selectedSubject: "",

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

    // Exam types
    let examTypes = await getExamType();
    let examTypesName = examTypes.map((element) => element.name);
    let selectedExamType = examTypesName[0];

    // Semesters
    let selectedSemester = this.state.semesters[0];

    // Subjects
    let subjects = await showSubjects(
      years,
      selectedClass,
      selectedSemester,
      this.context.siteName
    );
    let subjectsName = subjects.map((element) => element.name);
    let selectedSubject = subjectsName[0];

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
      examTypes,
      examTypesName,
      subjects,
      subjectsName,
      students,
      selectedClass,
      selectedSubject,
      selectedClassroom: selectedClassroom ? selectedClassroom : "None",
      selectedSemester,
      selectedExamType,
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

    // Subjects
    let subjects = await showSubjects(
      years,
      selectedClass,
      this.state.selectedSemester,
      this.context.siteName
    );
    let subjectsName = subjects.map((element) => element.name);
    let selectedSubject = subjectsName[0];

    let students = await showStudents(
      years,
      selectedClass,
      selectedClassroom,
      this.context.siteName
    );
    students = this.mapStudentsArray(students);

    this.setState({
      classroomsNumber,
      selectedClass,
      subjects,
      subjectsName,
      selectedSubject,
      selectedClassroom: selectedClassroom ? selectedClassroom : "None",
      students,
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

    this.setState({ selectedClassroom: element, students });
  };

  handleSelectSemester = async (selectedSemester) => {
    let years = this.context.account;

    // Subjects
    let subjects = await showSubjects(
      years,
      this.state.selectedClass,
      selectedSemester,
      this.context.siteName
    );
    let subjectsName = subjects.map((element) => element.name);
    let selectedSubject = subjectsName[0];

    this.setState({
      selectedSemester,
      subjects,
      subjectsName,
      selectedSubject,
    });
  };

  handleSelectType = (selectedExamType) => {
    this.setState({ selectedExamType });
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

  // Handle Date Change
  handleDateChange = ({ currentTarget }) => {
    this.setState({ examDate: currentTarget.value });
  };

  // Handle Subject Change
  handleSelectSubject = (selectedSubject) => {
    this.setState({ selectedSubject });
  };

  // Handle Send Marks
  handleSendMarks = async () => {
    let years = this.context.account;
    let {
      fullMark,
      students,
      selectedClass,
      selectedClassroom,
      examDate,
      examTypes,
      selectedExamType,
      subjects,
      selectedSubject,
    } = this.state;
    if (!examDate || !dateCompare(new Date(examDate), new Date())) {
      toast.error("Set a valid exam date");
      return;
    }
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
      let examTypeId = examTypes.find(
        (element) => element.name === selectedExamType
      ).id;

      let subjectId = subjects.find(
        (element) => element.name === selectedSubject
      ).id;

      try {
        await sendStudentsMark(
          years,
          selectedClass,
          selectedClassroom,
          fullMark,
          examDate,
          examTypeId,
          subjectId,
          students,
          this.context.siteName
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
      semesters,
      classroomsNumber,
      classes,
      examTypesName,
      subjectsName,
      examDate,
    } = this.state;

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
              <h4>Select a semester</h4>
              <Selection
                data={semesters}
                handleSelect={this.handleSelectSemester}
              />
            </div>

            <div className="selection-part">
              <h4>Select a type</h4>
              <Selection
                data={examTypesName}
                handleSelect={this.handleSelectType}
              />
            </div>

            <div className="selection-part">
              <h4>Select a subject</h4>
              <Selection
                data={subjectsName}
                handleSelect={this.handleSelectSubject}
              />
            </div>

            <div className="selection-part">
              <h4>Set the date</h4>
              <input
                type="date"
                value={examDate}
                onChange={this.handleDateChange}
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

export default SetMarks;
