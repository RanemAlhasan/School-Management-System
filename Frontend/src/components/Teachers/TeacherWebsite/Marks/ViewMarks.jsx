import React from "react";
import Selection from "../../../Selection";
import PeriodContext from "../../../../contexts/periodContext";
import Form from "../../../Form";
import StudentContext from "../../../../contexts/studentContext";
import { ToastContainer } from "react-toastify";
import {
  getTeacherClasses,
  getTeacherClassrooms,
  getTeacherSubjects,
  teacherGetStudentsMarks,
} from "../../../../services/teacherService";
import { getExamType } from "../../../../services/marksServices";
import { getTeacherDefaultValues } from "../../../../services/defaultContextValues";
import ViewStudentsMark from "../../../Marks/ViewStudentsMark";

class ViewMarks extends Form {
  static contextType = PeriodContext;

  state = {
    classes: [],
    classroomsNumber: [],
    semesters: [1, 2],
    examTypes: [],
    examTypesName: [],
    subjects: [],
    subjectsName: [],
    examDate: [],

    selectedClass: "",
    selectedClassroom: "",
    selectedSemester: "",
    selectedExamType: "",
    selectedSubject: "",
    selectedExamDate: "",

    fullMark: "",

    students: [],
    allMarks: [],

    // header
    headers: ["Student Name", "Mark", "Full Mark"],
  };

  componentDidMount = async () => {
    // Account
    let account = await getTeacherDefaultValues(this.context.account);

    // Classes
    let classes = await getTeacherClasses(account);
    let selectedClass = classes[0];

    // Classrooms
    let classroomsNumber = await getTeacherClassrooms(account, selectedClass);
    let selectedClassroom = classroomsNumber[0];

    // Exam types
    let examTypes = await getExamType();
    let examTypesName = examTypes.map((element) => element.name);
    let selectedExamType = examTypesName[0];

    // Semesters
    let selectedSemester = this.state.semesters[0];

    // Subjects
    let subjects = await getTeacherSubjects(
      account,
      selectedClass,
      selectedClassroom,
      selectedSemester
    );
    let subjectsName = subjects.map((element) => element.name);
    let selectedSubject = subjectsName[0];

    // Set the state
    this.setState({
      classes,
      classroomsNumber,
      examTypes,
      examTypesName,
      subjects,
      subjectsName,
      selectedClass,
      selectedClassroom,
      selectedSemester,
      selectedExamType,
      selectedSubject,
    });
  };

  // Load Students Marks

  loadStudentsMarks = async () => {
    let account = this.context.account;

    let {
      selectedClass,
      selectedClassroom,
      examTypes,
      selectedExamType,
      subjects,
      selectedSubject,
    } = this.state;

    let typeId = examTypes.find((type) => type.name === selectedExamType);
    typeId = typeId ? typeId.id : "";
    let subjectId = subjects.find(
      (element) => element.name === selectedSubject
    );
    subjectId = subjectId ? subjectId.id : "";

    let students = await teacherGetStudentsMarks(
      account,
      selectedClass,
      selectedClassroom,
      subjectId,
      typeId
    );

    let allMarks = students;
    let examDate = students.map((element) =>
      new Date(element.dateOfExam).toDateString()
    );
    let selectedExamDate = 0;
    let fullMark = students[0] ? students[0].fullMark : "";
    students = students[0] ? students[0].marks : [];
    students = students.sort((a, b) =>
      a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    );

    this.setState({
      examDate,
      selectedExamDate,
      students,
      allMarks,
      fullMark,
    });
  };

  // Handle Selection

  handleSelectClass = async (selectedClass) => {
    // Account
    let account = this.context.account;

    // Classrooms
    let classroomsNumber = await getTeacherClassrooms(account, selectedClass);
    let selectedClassroom = classroomsNumber[0];

    // Subjects
    let subjects = await getTeacherSubjects(
      account,
      selectedClass,
      selectedClassroom,
      this.state.selectedSemester
    );
    let subjectsName = subjects.map((element) => element.name);
    let selectedSubject = subjectsName[0];

    this.setState({
      classroomsNumber,
      selectedClass,
      selectedClassroom,
      subjects,
      subjectsName,
      selectedSubject,
    });
  };

  handleSelectClassrooms = async (selectedClassroom) => {
    let subjects = await getTeacherSubjects(
      this.context.account,
      this.state.selectedClass,
      selectedClassroom,
      this.state.selectedSemester
    );

    let subjectsName = subjects.map((element) => element.name);
    let selectedSubject = subjectsName[0];
    this.setState({
      selectedClassroom,
      subjects,
      subjectsName,
      selectedSubject,
    });
  };

  handleSelectSemester = async (selectedSemester) => {
    let subjects = await getTeacherSubjects(
      this.context.account,
      this.state.selectedClass,
      this.state.selectedClassroom,
      selectedSemester
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

  handleSelectSubject = (selectedSubject) => {
    this.setState({ selectedSubject });
  };

  handleSelectExamDate = (selectedExamDate, index) => {
    let { allMarks } = this.state;
    let students = allMarks[index].marks;
    students = students.sort((a, b) =>
      a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    );

    this.setState({
      selectedExamDate: index,
      students,
      fullMark: allMarks[index].fullMark,
    });
  };

  renderStudents = (length) => {
    return length ? <ViewStudentsMark /> : null;
  };

  renderDateSelection = () => {
    return this.state.allMarks.length > 1 ? (
      <div className="selection-part exam-date">
        <h4>Select a date</h4>
        <Selection
          data={this.state.examDate}
          handleSelect={(element, index) =>
            this.handleSelectExamDate(element, index)
          }
        />
      </div>
    ) : null;
  };

  // Sorting The Students
  handleNameSort = (sortType) => {
    let students = [...this.state.students];
    if (sortType === "DES") {
      students = students.sort((a, b) =>
        a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
      );
    } else {
      students = students.sort((a, b) =>
        a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
      );
    }
    this.setState({ students });
  };

  handleMarkSort = (sortType) => {
    let students = [...this.state.students];
    if (sortType === "DES") {
      students = students.sort((a, b) =>
        parseInt(a.mark) < parseInt(b.mark) ? 1 : -1
      );
    } else {
      students = students.sort((a, b) =>
        parseInt(a.mark) < parseInt(b.mark) ? -1 : 11
      );
    }
    this.setState({ students });
  };

  render() {
    let {
      fullMark,
      students,
      semesters,
      subjectsName,
      classroomsNumber,
      classes,
      examTypesName,
      headers,
    } = this.state;

    return (
      <div id="marks">
        <ToastContainer />
        <StudentContext.Provider
          value={{
            students,
            fullMark,
            headers,
            handleNameSort: this.handleNameSort,
            handleMarkSort: this.handleMarkSort,
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
                heading={this.state.selectedClassroom}
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
          </div>

          <button id="load-marks" onClick={this.loadStudentsMarks}>
            Get Marks
          </button>
          {this.renderDateSelection()}
          {this.renderStudents(students.length)}
        </StudentContext.Provider>
      </div>
    );
  }
}

export default ViewMarks;
