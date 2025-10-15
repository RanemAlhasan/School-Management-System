import React, { Component } from "react";
import {
  getExamType,
  showClasses,
  showSubjects,
} from "../../../services/marksServices";
import Selection from "../../Selection";
import { ToastContainer, toast } from "react-toastify";
import ExamSet from "../ExamSet";
import PeriodContext from "../../../contexts/periodContext";
import {
  getClassesAnnouncements,
  getClassroomsAnnouncements,
} from "../../../services/announcementsService";
import {
  sendClassExamSchedule,
  sendClassroomExamSchedule,
} from "../../../services/schoolService";

class SetExamSchedule extends Component {
  static contextType = PeriodContext;

  state = {
    classes: [],
    classrooms: [],
    classroomsNumber: [],
    semesters: [1, 2],
    subjects: [],
    subjectsName: [],
    examTypes: [],

    selectedClass: "",
    selectedClassroom: "",
    selectedSemester: "",
    selectedSubject: "",
    examsNumber: "",
    selectedExamType: "",

    result: [],
    mapNumber: [],
  };

  componentDidMount = async () => {
    // Year
    let years = this.context.account;

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
    classroomsNumber = ["All", ...classroomsNumber];
    let selectedClassroom = classroomsNumber[0];

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

    // Exam Types
    let types = await getExamType();
    types = types.filter(
      (element) =>
        element.name === "Midterm Exam" || element.name === "Final Exam"
    );
    let selectedExamType = types[0] ? types[0].name : "";

    // Set the state
    this.setState({
      classes,
      classrooms,
      classroomsNumber,
      subjects,
      subjectsName,
      selectedClass,
      selectedSubject,
      selectedClassroom: selectedClassroom ? selectedClassroom : "None",
      selectedSemester,
      selectedExamType,
      examTypes: types,
    });
  };

  // Handle Selection

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
    classroomsNumber = ["All", ...classroomsNumber];
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

    this.setState({
      classrooms,
      classroomsNumber,
      selectedClass,
      subjects,
      subjectsName,
      selectedSubject,
      selectedClassroom: selectedClassroom ? selectedClassroom : "None",
    });
  };

  handleSelectClassrooms = async (element) => {
    this.setState({ selectedClassroom: element });
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

  // Handle Subject Change
  handleSelectSubject = (selectedSubject) => {
    this.setState({ selectedSubject });
  };

  handleExamNumberChange = ({ currentTarget }) => {
    let result = this.mapExamsNumber(currentTarget.value);

    this.setState({
      examsNumber: currentTarget.value,
      result: result[0],
      mapNumber: result[1],
    });
  };

  mapExamsNumber = (examsNumber) => {
    let arr = [];
    for (let i = 0; i < examsNumber; i++) {
      arr.push(i);
    }
    let result = [];
    for (let i = 0; i < arr.length; i++) {
      if (!this.state.result[i]) {
        result[i] = {
          date: "",
          startTime: "",
          endTime: "",
          subjectInSemesterId: this.state.subjects[0]
            ? this.state.subjects[0].id
            : "",
        };
      } else result[i] = this.state.result[i];
    }
    return [result, arr];
  };

  handleSubjectChange = (selectedSubject, index) => {
    let result = [...this.state.result];
    let obj = { ...result[index] };
    let { subjects } = this.state;
    let subjectInSemesterId = subjects.find(
      (element) => element.name === selectedSubject
    ).id;
    obj["subjectInSemesterId"] = subjectInSemesterId;
    result[index] = obj;
    this.setState({ result });
  };

  handleTimeChange = ({ currentTarget }, index) => {
    let result = [...this.state.result];
    let obj = { ...result[index] };
    obj[currentTarget.name] = currentTarget.value;
    result[index] = obj;
    this.setState({ result });
  };

  handleDateChange = ({ currentTarget }, index) => {
    let result = [...this.state.result];
    let obj = { ...result[index] };
    obj["date"] = currentTarget.value;
    result[index] = obj;
    this.setState({ result });
  };

  handleSelectType = (selectedExamType) => {
    this.setState({ selectedExamType });
  };

  hanldeSendSchedule = async () => {
    let { result } = this.state;
    for (let element of result) {
      if (
        !element.date ||
        !element.startTime ||
        !element.endTime ||
        !element.subjectInSemesterId
      ) {
        toast.error("Fill the empty data please");
        return;
      }
    }
    let {
      classrooms,
      selectedClassroom,
      selectedClass,
      selectedExamType,
      examTypes,
    } = this.state;

    let examTypeId = examTypes.find(
      (element) => element.name === selectedExamType
    ).id;

    if (selectedClassroom === "All") {
      let schoolClass = await getClassesAnnouncements(
        this.context.account,
        this.context.siteName
      );
      let schoolClassId = schoolClass.find(
        (element) => element.className === selectedClass
      ).schoolClassId;
      try {
        await sendClassExamSchedule(
          schoolClassId,
          this.state.result,
          this.context.account,
          this.context.siteName,
          examTypeId
        );
        toast.success("Exam schedule has been set successfully");
      } catch (error) {}
    } else {
      let classroomId = classrooms.find(
        (element) => element.classroomNumber === selectedClassroom
      ).classroomId;
      try {
        await sendClassroomExamSchedule(
          classroomId,
          this.state.result,
          this.context.account,
          this.context.siteName,
          examTypeId
        );
        toast.success("Exam schedule has been set successfully");
      } catch (error) {}
    }
  };

  render() {
    let {
      semesters,
      classroomsNumber,
      classes,
      subjectsName,
      examsNumber,
      result,
      examTypes,
    } = this.state;
    examTypes = examTypes.map((element) => element.name);

    return (
      <div id="exam-schedule">
        <ToastContainer />

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
            <Selection data={examTypes} handleSelect={this.handleSelectType} />
          </div>
        </div>
        <div className="multiple-exam">
          <div className="exams-number">
            <input
              type="number"
              className="exams-number"
              min={0}
              value={examsNumber}
              placeholder="Exams Number"
              onChange={this.handleExamNumberChange}
            />
          </div>
          {this.state.mapNumber.map((element, index) => (
            <ExamSet
              key={index}
              subjects={subjectsName}
              element={this.state.result[index]}
              handleSubjectChange={(selectedSubject) =>
                this.handleSubjectChange(selectedSubject, index)
              }
              handleTimeChange={(time) => this.handleTimeChange(time, index)}
              handleDateChange={(date) => this.handleDateChange(date, index)}
              date={result[index].date}
              startTime={result[index].startTime}
              endTime={result[index].endTime}
            />
          ))}
        </div>
        {examsNumber && (
          <button onClick={this.hanldeSendSchedule}>Submit</button>
        )}
      </div>
    );
  }
}
export default SetExamSchedule;
