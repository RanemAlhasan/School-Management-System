import PeriodContext from "../../../contexts/periodContext";
import Selection from "../../Selection";
import React, { Component } from "react";
import {
  getMyStudents,
  getStudentPayments,
} from "../../../services/studentService";
import FeesTable from "./FeesTable";

class ViewStudentPayments extends Component {
  static contextType = PeriodContext;

  state = {
    students: [],
    studentsNames: [],
    payments: [],

    search: "",
    selectedStudent: "",
  };

  componentDidMount = async () => {
    let years = this.context.account;

    let { data } = await getMyStudents(years, this.context.siteName);
    data = data.students.map((element) => ({
      studentId: element.studentId,
      studentName:
        element.student.personalInfo.firstName +
        " " +
        element.student.personalInfo.lastName,
    }));
    let studentsNames = data.map((element) => element.studentName);

    let selectedStudent = studentsNames[0];

    this.setState({ students: data, studentsNames, selectedStudent });
  };

  handleInputChange = ({ currentTarget }) => {
    let students = [...this.state.students];
    let studentsNames = students.filter((element) =>
      element.studentName
        .toLowerCase()
        .includes(currentTarget.value.trim().toLowerCase())
    );
    studentsNames = studentsNames.map((element) => element.studentName);
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

  showPayments = async () => {
    let { siteName, account } = this.context;
    let studentId = this.state.students.find(
      (element) => element.studentName === this.state.selectedStudent
    );
    studentId = studentId ? studentId.studentId : "";
    let payments = await getStudentPayments(siteName, account, studentId);
    this.setState({ payments });
  };

  render() {
    let { search, studentsNames, selectedStudent, payments } = this.state;
    return (
      <div id="absence">
        <div className="selection-container">
          <input
            type="text"
            placeholder="Search Student"
            value={search}
            onChange={this.handleInputChange}
          />
          <Selection
            data={studentsNames}
            handleSelect={this.handleSelectStudent}
            heading={selectedStudent}
          />
        </div>
        <button onClick={this.showPayments}>Show Payments</button>
        <FeesTable payments={payments} />
      </div>
    );
  }
}

export default ViewStudentPayments;
