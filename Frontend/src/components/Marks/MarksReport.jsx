import React, { Component } from "react";
import PeriodContext from "../../contexts/periodContext";
import { getMarksReport } from "../../services/marksServices";
import { getMyStudents } from "../../services/studentService";
import Selection from "../Selection";
import MarksReportTable from "./MarksReportTable";

class MarksReport extends Component {
  static contextType = PeriodContext;

  state = {
    students: [],
    showArray: [],
    marks: [],

    selectedStudent: "",
    search: "",
    pressed: false,
  };

  componentDidMount = async () => {
    let { account, siteName } = this.context;

    let { data } = await getMyStudents(account, siteName);
    data = data.students.map((element) => ({
      studentId: element.studentId,
      studentName:
        element.student.personalInfo.firstName +
        " " +
        element.student.personalInfo.lastName,
    }));
    let showArray = data.map((element) => element.studentName);
    let selectedStudent = data[0] ? data[0].studentName : "";

    this.setState({ students: data, selectedStudent, showArray });
  };

  hanldeInputChange = ({ currentTarget }) => {
    let { students } = this.state;
    let showArray = students.filter((element) =>
      element.studentName
        .toLowerCase()
        .includes(currentTarget.value.toLowerCase())
    );
    showArray = showArray.map((element) => element.studentName);
    this.setState({ search: currentTarget.value, showArray });
  };

  handleStudentSelect = (selectedStudent) => {
    this.setState({ selectedStudent });
  };

  showReport = async () => {
    let { students, selectedStudent } = this.state;
    let studentId = students.find(
      (element) => element.studentName === selectedStudent
    );
    studentId = studentId ? studentId.studentId : "";
    let data = await getMarksReport(
      studentId,
      this.context.account,
      this.context.siteName
    );
    this.setState({ marks: data, pressed: true });
  };

  render() {
    let { search, showArray, marks, pressed } = this.state;
    console.log(marks);
    return (
      <div className="marks-report">
        <div className="selection-container">
          <input
            type="search"
            value={search}
            onChange={this.hanldeInputChange}
            placeholder="Search Student"
          />
          <Selection data={showArray} handleSelect={this.handleStudentSelect} />
          <button onClick={this.showReport}>Show Marks Report</button>
        </div>
        {marks.length !== 0 ? (
          <MarksReportTable marks={marks} pressed={pressed} />
        ) : null}
      </div>
    );
  }
}

export default MarksReport;
