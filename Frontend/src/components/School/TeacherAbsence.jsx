import { showTeachersInYear } from "../../services/announcementsService";
import PeriodContext from "../../contexts/periodContext";
import Selection from "../Selection";
import React, { Component } from "react";

class TeacherAbsence extends Component {
  static contextType = PeriodContext;

  state = {
    teachers: [],
    teachersNames: [],
    search: "",
    selectedTeacher: "",
  };

  componentDidMount = async () => {
    let years = this.context.account;

    let teachers = await showTeachersInYear(years, this.context.siteName);
    let teachersNames = teachers.map((teacher) => teacher.name);
    let selectedTeacher = teachersNames[0];
    this.setState({ teachers, teachersNames, selectedTeacher });
    let id = selectedTeacher ? teachers[0].id : -1;
    this.props.setDestinationId(id);
  };

  handleInputChange = ({ currentTarget }) => {
    let teachers = [...this.state.teachers];
    let teachersNames = teachers.filter((element) =>
      element.name
        .toLowerCase()
        .includes(currentTarget.value.trim().toLowerCase())
    );
    teachersNames = teachersNames.map((element) => element.name);
    let selectedTeacher = teachersNames[0];
    this.setState({
      search: currentTarget.value,
      teachersNames,
      selectedTeacher,
    });
    let id = teachers.find((element) => element.name === selectedTeacher);
    id = id ? id.id : -1;
    this.props.setDestinationId(id);
  };

  handleSelectTeacher = (selectedTeacher) => {
    this.setState({ selectedTeacher });
    let id = this.state.teachers.find(
      (element) => element.name === selectedTeacher
    ).id;
    this.props.setDestinationId(id);
  };

  render() {
    let { search, teachersNames, selectedTeacher } = this.state;
    return (
      <div className="selection-container">
        <input
          type="text"
          placeholder="Search Teacher"
          value={search}
          onChange={this.handleInputChange}
        />
        <Selection
          data={teachersNames}
          handleSelect={this.handleSelectTeacher}
          heading={selectedTeacher}
        />
      </div>
    );
  }
}

export default TeacherAbsence;
