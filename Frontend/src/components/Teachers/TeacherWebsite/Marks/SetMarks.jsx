import React from "react";
import Form from "../../../Form";
import PeriodContext from "../../../../contexts/periodContext";
import { getTeacherDefaultValues } from "../../../../services/defaultContextValues";
import {
  getTeacherClasses,
  getTeacherClassrooms,
  getTeacherStudents,
  getTeacherSubjects,
  teacherSetStudentsMarks,
} from "../../../../services/teacherService";
import { getExamType } from "../../../../services/marksServices";
import Selection from "../../../Selection";
import StudentContext from "../../../../contexts/studentContext";
import SetStudentsMark from "../../../Marks/SetStudentsMark";
import { dateCompare } from "../../../../services/dateCompare";
import { toast, ToastContainer } from "react-toastify";

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
    mappedData: new Map(),

    selectedClass: "",
    selectedClassroom: "",
    selectedSemester: "",
    selectedExamType: "",
    selectedSubject: "",

    fullMark: "",
    examDate: "",
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
    console.log(subjects);
    let subjectsName = subjects.map((element) => element.name);
    let selectedSubject = subjectsName[0];

    // Students
    let [students, mappedData] = await getTeacherStudents(
      account,
      selectedClass,
      selectedClassroom
    );

    // Set the state
    this.setState({
      classes,
      classroomsNumber,
      subjects,
      subjectsName,
      examTypes,
      examTypesName,
      selectedSubject,
      selectedClassroom,
      selectedClass,
      selectedExamType,
      selectedSemester,
      students,
      mappedData,
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
      subjects,
      subjectsName,
      selectedSubject,
      selectedClassroom,
    });
  };

  handleSelectClassrooms = async (selectedClassroom) => {
    // Account
    let { account } = this.context;
    let { selectedClass, selectedSemester } = this.state;

    // Subjects
    let subjects = await getTeacherSubjects(
      account,
      selectedClass,
      selectedClassroom,
      selectedSemester
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
    let account = this.context.account;
    let { selectedClass, selectedClassroom } = this.state;

    // Subjects
    let subjects = await getTeacherSubjects(
      account,
      selectedClass,
      selectedClassroom,
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

  // Handle Date Change

  handleDateChange = ({ currentTarget }) => {
    this.setState({ examDate: currentTarget.value });
  };

  // Handle Subject Change

  handleSelectSubject = (selectedSubject) => {
    this.setState({ selectedSubject });
  };

  // Handle Full Mark Change

  changeFullMark = ({ currentTarget }) => {
    this.setState({ fullMark: currentTarget.value });
  };

  // Handle Student Mark Change

  changeStdMark = ({ currentTarget }) => {
    let { mappedData, students } = this.state;
    let index = mappedData.get(parseInt(currentTarget.name));
    let student = { ...students[index] };
    student["mark"] = currentTarget.value;
    students[index] = student;
    this.setState({ students });
  };

  // Handle Send Marks
  handleSendMarks = async () => {
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
      if (parseInt(mark) < 0 || parseInt(mark) > parseInt(fullMark)) {
        errors.push(name);
      }
    }
    if (errors.length) {
      let errorMessage = `set a valid mark for ${errors}`.replaceAll(",", ", ");
      toast.error(errorMessage);
    } else {
      let examTypeId = examTypes.find(
        (element) => element.name === selectedExamType
      ).id;

      let subjectId = subjects.find(
        (element) => element.name === selectedSubject
      ).id;
      let newObj = {
        fullMark,
        subjectInSemesterId: subjectId,
        examTypeId,
        marks: students.map((element) => ({
          studentInClassId: element.id,
          value: element.mark ? parseInt(element.mark) : 0,
        })),
        dateOfExam: examDate,
      };
      try {
        await teacherSetStudentsMarks(
          this.context.account,
          selectedClass,
          selectedClassroom,
          newObj
        );
        toast.success("Marks have been set successfully");
      } catch (error) {}
    }
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
    console.log(students);
    return (
      <StudentContext.Provider
        value={{
          students,
          fullMark,
          handleSendMarks: this.handleSendMarks,
          handleFullMarkChange: this.changeFullMark,
          handleStdMarkChange: this.changeStdMark,
        }}
      >
        <ToastContainer />
        <div id="marks">
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

            <div className="selection-part">
              <h4>Set the date</h4>
              <input
                type="date"
                value={examDate}
                onChange={this.handleDateChange}
              />
            </div>
          </div>
          {students.length !== 0 && <SetStudentsMark />}
        </div>
      </StudentContext.Provider>
    );
  }
}

export default SetMarks;
