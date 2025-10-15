import React, { Component } from "react";
import { getStudentsAnnouncements } from "../../../services/announcementsService";
import PeriodContext from "../../../contexts/periodContext";
import Selection from "../../Selection";

class StudentAnnouncements extends Component {
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
    let studentsNames = students.map((element) => element.name);
    let selectedStudent = studentsNames[0];
    this.setState({ students, studentsNames, selectedStudent });
    let id = students[0] ? students[0].studentId : -1;
    this.props.setDestinationId(id);
  };

  handleSearchChange = ({ currentTarget }) => {
    let studentsNames = [...this.state.studentsNames];
    let { students } = this.state;
    studentsNames = students.map((element) => element.name);
    studentsNames = studentsNames.filter((element) =>
      element.toLowerCase().includes(currentTarget.value.trim().toLowerCase())
    );
    let selectedStudent = studentsNames[0];
    this.setState({
      search: currentTarget.value,
      studentsNames,
      selectedStudent,
    });
    let id = students.find((element) => element.name === selectedStudent);
    id = id ? id.studentId : -1;
    this.props.setDestinationId(id);
  };

  handleSelectStudent = (selectedStudent) => {
    this.setState({ selectedStudent });
    let id = this.state.students.find(
      (element) => element.name === selectedStudent
    );
    id = id ? id.studentId : -1;
    this.props.setDestinationId(id);
  };

  render() {
    let { search, studentsNames } = this.state;
    return (
      <React.Fragment>
        <div className="selection-container">
          <input
            type="text"
            placeholder="Search Student"
            value={search}
            onChange={this.handleSearchChange}
          />
          <Selection
            data={studentsNames}
            handleSelect={this.handleSelectStudent}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default StudentAnnouncements;
