import React, { Component } from "react";
import {
  getMyStudents,
  decodeStudentAbsence,
  getStudentAbsence,
  decodeStudents,
} from "../../services/studentService";
import PeriodContext from "../../contexts/periodContext";
import { ToastContainer } from "react-toastify";
import Selection from "../Selection";
import AbsenceTable from "../School/AbsenceTable";

class ShowStudentAbsence extends Component {
  static contextType = PeriodContext;

  state = {
    studentAbsence: [],
    search: "",
    students: [],
    studentsNames: [],
    studentAbsenceToShow: [],
    selectedStudent: "",
    helper: 0,
  };

  componentDidMount = async () => {
    try {
      let { data } = await getMyStudents(
        this.context.account,
        this.context.siteName
      );
      let students = decodeStudents(data);
      try {
        let { data } = await getStudentAbsence(
          this.context.account,
          this.context.siteName
        );
        let result = decodeStudentAbsence(data);
        let studentsNames = students.map((student) => student.name);
        let selectedStudent = studentsNames[0];
        this.setState({
          studentAbsence: result,
          students,
          studentsNames,
          selectedStudent,
        });
      } catch (error) {
        this.setState({
          students,
        });
      }
    } catch (error) {}
  };

  handleSearchChange = ({ currentTarget }) => {
    let students = [...this.state.students];
    let studentsNames = students.filter((element) =>
      element.name
        .toLowerCase()
        .includes(currentTarget.value.trim().toLowerCase())
    );
    studentsNames = studentsNames.map((element) => element.name);
    let selectedStudent = studentsNames[0];
    this.setState({
      search: currentTarget.value,
      studentsNames,
      selectedStudent,
    });
  };

  handleSelectStudent = (selectedStudent) => {
    this.setState({ selectedStudent });
  };
  renderStudentAbsence = () => {
    let studentAbsence = this.state.studentAbsence;
    let selectedStudent = this.state.selectedStudent;
    let studentAbsenceToShow = studentAbsence.filter(
      (student) => student.name === selectedStudent
    );
    this.setState({
      studentAbsenceToShow,
      helper: 1,
    });
  };

  renderInput = () => {
    if (!this.state.students.length) {
      return <h1 id="empty">No student to show</h1>;
    } else if (!this.state.studentAbsence.length) {
      return <h1 id="empty">No student absence to show</h1>;
    }
    return (
      <div>
        <div className="selection-container">
          <input
            type="text"
            placeholder="Search Student"
            onChange={this.handleSearchChange}
          />
          <Selection
            data={this.state.studentsNames}
            handleSelect={this.handleSelectStudent}
            heading={this.state.selectedStudent}
          />
        </div>
        <button onClick={this.renderStudentAbsence}>Show</button>
      </div>
    );
  };

  show = () => {
    let helper = this.state.helper;
    if (!helper) {
      return null;
    }
    let studentAbsence = [...this.state.studentAbsenceToShow];
    if (!studentAbsence.length) {
      return <h1 id="empty">The student has never been absent before</h1>;
    }
    let selectedStudent = this.state.selectedStudent;
    let props = {
      absences: studentAbsence,
      name: selectedStudent,
    };
    return <AbsenceTable {...props} />;
  };

  render() {
    return (
      <div id="get-teachers">
        <ToastContainer />
        {this.renderInput()}
        {this.show()}
      </div>
    );
  }
}

export default ShowStudentAbsence;
