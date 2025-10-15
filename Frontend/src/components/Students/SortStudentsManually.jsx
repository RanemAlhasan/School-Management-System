import React, { Component } from "react";
import {
  sendSortedStudents,
  showStudentsInSort,
} from "../../services/studentService";
import PeriodContext from "../../contexts/periodContext";
import { showClasses, showClassrooms } from "../../services/marksServices";
import Selection from "../Selection";
import { toast, ToastContainer } from "react-toastify";

class SortStudentsManually extends Component {
  static contextType = PeriodContext;

  state = {
    students: [],
    classes: [],
    calssrooms: [],

    selectedClass: "",
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

    // Students
    let students = await showStudentsInSort(
      years,
      selectedClass,
      this.context.siteName
    );

    // Setting The State
    this.setState({
      students,
      classes,
      classrooms,
      selectedClass: selectedClass ? selectedClass : "None",
    });
  };

  handleSelectClass = async (selectedClass) => {
    let years = this.context.account;

    let classrooms = await showClassrooms(
      years,
      selectedClass,
      this.context.siteName
    );
    let students = await showStudentsInSort(
      years,
      selectedClass,
      this.context.siteName
    );

    this.setState({ classrooms, selectedClass, students });
  };

  handleSelectClassroom = (element, id) => {
    let students = [...this.state.students];
    let student = students.find(
      (student) => parseInt(student.id) === parseInt(id)
    );
    student["classroomNumber"] = element;
    this.setState({ students });
  };

  renderSelection = () => {
    let { classes } = this.state;
    return (
      <React.Fragment>
        <h4>Select a class</h4>
        <Selection data={classes} handleSelect={this.handleSelectClass} />
      </React.Fragment>
    );
  };

  sendSort = async () => {
    let students = this.state.students;
    console.log(students);
    for (let student of students) {
      if (!student["classroomNumber"])
        student["classroomNumber"] = this.state.classrooms[0];
    }
    students = students.map((element) => ({
      id: element.id,
      classroomNumber: element.classroomNumber,
    }));
    try {
      await sendSortedStudents(
        this.context.account,
        this.state.selectedClass,
        students,
        this.context.siteName
      );
      toast.success("Students have been sorted successfully");
    } catch (error) {}
  };

  render() {
    return (
      <div id="sort-students">
        <ToastContainer />
        {this.renderSelection()}
        <div id="sort-form-container">
          {this.state.students.map((student) => (
            <div className="sort-form" key={student.id}>
              <div className="sort-title">
                <i className="las la-star" />
              </div>
              <div className="form-section">
                <p>{student.name}</p>
                <Selection
                  data={this.state.classrooms}
                  handleSelect={(element) =>
                    this.handleSelectClassroom(element, student.id)
                  }
                />
              </div>
            </div>
          ))}
        </div>
        {this.state.students.length ? (
          <button className="sort" onClick={this.sendSort}>
            Send
          </button>
        ) : (
          <h1>No students to show</h1>
        )}
      </div>
    );
  }
}

export default SortStudentsManually;
