import React, { Component } from "react";
import { showTeachersInYear } from "../../../services/announcementsService";
import PeriodContext from "../../../contexts/periodContext";
import Selection from "../../Selection";

class TeacherAnnouncements extends Component {
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
    let teachersNames = teachers.map((element) => element.name);
    let selectedTeacher = teachersNames[0];
    this.setState({ teachers, teachersNames, selectedTeacher });
    let id = teachers[0] ? teachers[0].id : -1;
    this.props.setDestinationId(id);
  };

  handleSearchChange = ({ currentTarget }) => {
    let teachersNames = [...this.state.teachersNames];
    let { teachers } = this.state;
    teachersNames = teachers.map((element) => element.name);
    teachersNames = teachersNames.filter((element) =>
      element.toLowerCase().includes(currentTarget.value.trim().toLowerCase())
    );
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
    );
    id = id ? id.id : -1;
    this.props.setDestinationId(id);
  };

  render() {
    let { search, teachersNames } = this.state;
    return (
      <React.Fragment>
        <div className="selection-container">
          <input
            type="text"
            placeholder="Search Teacher"
            value={search}
            onChange={this.handleSearchChange}
          />
          <Selection
            data={teachersNames}
            handleSelect={this.handleSelectTeacher}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default TeacherAnnouncements;
