import { getStudentsAnnouncements } from "../../services/announcementsService";
import PeriodContext from "../../contexts/periodContext";
import Selection from "../Selection";
import React, { Component } from "react";

class StudentAbsence extends Component {
  static contextType = PeriodContext;

  state = {
    students: [],
    studentsNames: [],
    search: "",
    selectedStudent: "",
  };

  componentDidMount = async () => {
    let years = this.context.account;

    let students = await getStudentsAnnouncements(years, this.context.siteName);
    let studentsNames = students.map((student) => student.name);
    let selectedStudent = studentsNames[0];
    this.setState({ students, studentsNames, selectedStudent });
    let id = selectedStudent ? students[0].studentId : -1;
    this.props.setDestinationId(id);
  };

  handleInputChange = ({ currentTarget }) => {
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
    let id = students.find((element) => element.name === selectedStudent);
    id = id ? id.studentId : -1;this.props.setDestinationId(id);
  };

  handleSelectStudent = (selectedStudent) => {
    this.setState({ selectedStudent });
    let id = this.state.students.find(
      (element) => element.name === selectedStudent
    ).studentId;
    this.props.setDestinationId(id);
  };

  render() {
    let { search, studentsNames, selectedStudent } = this.state;
    return (
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
    );
  }
}

export default StudentAbsence;
