import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import { showClasses, showClassrooms } from "../../services/marksServices";
import PeriodContext from "../../contexts/periodContext";
import Selection from "../Selection";
import {
  promoteStudentsClasses,
  showStudentsInClassroom,
} from "../../services/studentService";
import StudentsPromotionTable from "./StudentsPromotionTable";

class UpgradeStudents extends Component {
  static contextType = PeriodContext;

  state = {
    students: [],
    classes: [],
    classrooms: [],
    result: new Map(),

    selectAll: false,
    selectedClass: "",
    selectedClassroom: "",
  };

  componentDidMount = async () => {
    // Years
    let years = this.context.account;

    // Classes
    let classes = await showClasses(years, this.context.siteName);
    let selectedClass = classes[0];

    // Classrooms
    let classrooms = await showClassrooms(
      years,
      selectedClass,
      this.context.siteName
    );
    let selectedClassroom = classrooms[0];

    let students = await showStudentsInClassroom(
      years,
      selectedClass,
      selectedClassroom,
      this.context.siteName
    );

    this.setState({
      classes,
      classrooms,
      selectedClassroom: selectedClassroom ? selectedClassroom : "None",
      selectedClass: selectedClass ? selectedClass : "None",
      students,
    });
  };

  handleClassChange = async (selectedClass) => {
    // Classrooms
    let classrooms = await showClassrooms(
      this.context.account,
      selectedClass,
      this.context.siteName
    );
    let selectedClassroom = classrooms[0];

    let students = await showStudentsInClassroom(
      this.context.account,
      selectedClass,
      selectedClassroom,
      this.context.siteName
    );

    this.setState({
      classrooms,
      selectedClassroom: selectedClassroom ? selectedClassroom : "None",
      selectedClass,
      students,
    });
  };

  hanldeSelectAll = () => {
    let { result, selectAll, students } = this.state;
    if (!selectAll)
      students.forEach((element) => result.set(element.studentId, true));
    else result.clear();
    this.setState({ result, selectAll: !selectAll });
  };

  // Classroom
  handleClassroomChange = async (selectedClassroom) => {
    let students = await showStudentsInClassroom(
      this.context.account,
      this.state.selectedClass,
      selectedClassroom,
      this.context.siteName
    );

    this.setState({
      selectedClassroom,
      students,
    });
  };

  handleSelectStudent = ({ studentId }) => {
    let { result } = this.state;
    if (result.get(studentId)) result.set(studentId, false);
    else result.set(studentId, true);
    this.setState({ result });
  };

  promoteStudents = async () => {
    let { result, selectedClass, students } = this.state;
    try {
      await promoteStudentsClasses(
        this.context.account,
        this.context.siteName,
        selectedClass,
        result
      );
      toast.success("Students have been promoted successfully");
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("Next class must be added to the next year");
      else {
        let arrNames = [];
        for (let i = 0; i < error.response.data; i++)
          arrNames.push(
            students.find(
              (element) => element.studentId === error.response.data[i]
            ).name
          );
        toast.error(`Students ${arrNames} have already been promoted before`);
      }
    }
  };

  render() {
    let {
      classes,
      students,
      classrooms,
      result,
      selectAll,
      selectedClass,
      selectedClassroom,
    } = this.state;
    return (
      <div id="get-students" className="promote-std">
        <ToastContainer />
        <div id="selection-container">
          <div className="selection-part">
            <h4>Select a class</h4>
            <Selection
              data={classes}
              handleSelect={this.handleClassChange}
              heading={selectedClass}
            />
          </div>
          <div className="selection-part">
            <h4>Select a classroom</h4>
            <Selection
              data={classrooms}
              handleSelect={this.handleClassroomChange}
              heading={selectedClassroom}
            />
          </div>
        </div>
        {students.length !== 0 && (
          <React.Fragment>
            <StudentsPromotionTable
              students={students}
              selectStudent={this.handleSelectStudent}
              result={result}
              handleSelectAll={this.hanldeSelectAll}
              selectAll={selectAll}
            />
            <button className="promote" onClick={this.promoteStudents}>
              Promote Students
            </button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default UpgradeStudents;
