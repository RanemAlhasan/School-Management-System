import React, { Component } from "react";
import { showClasses } from "../../../services/marksServices";
import PeriodContext from "../../../contexts/periodContext";
import Selection from "../../Selection";
import { getClassroomsAnnouncements } from "../../../services/announcementsService";

class ClassoomAnnouncements extends Component {
  static contextType = PeriodContext;

  state = {
    classes: [],
    classrooms: [],
    classroomsNumber: [],
    selectedClass: "",
    selectedClassroom: "",
  };

  componentDidMount = async () => {
    let years = this.context.account;
    let classes = await showClasses(years, this.context.siteName);
    let selectedClass = classes[0];
    let classrooms = await getClassroomsAnnouncements(
      years,
      selectedClass,
      this.context.siteName
    );
    let classroomsNumber = classrooms.map((element) => element.classroomNumber);
    let selectedClassroom = classroomsNumber[0];
    this.setState({
      classes,
      classrooms,
      selectedClass,
      classroomsNumber,
      selectedClassroom,
    });
    let id = classrooms[0] ? classrooms[0].classroomId : -1;
    this.props.setDestinationId(id);
  };

  handleSelectClass = async (selectedClass) => {
    let years = this.context.account;
    let classrooms = await getClassroomsAnnouncements(
      years,
      selectedClass,
      this.context.siteName
    );
    let classroomsNumber = classrooms.map((element) => element.classroomNumber);
    let selectedClassroom = classroomsNumber[0];

    this.setState({
      selectedClass,
      classrooms,
      classroomsNumber,
      selectedClassroom,
    });
    let id = classrooms[0] ? classrooms[0].classroomId : -1;
    this.props.setDestinationId(id);
  };

  handleSelectClassroom = async (selectedClassroom) => {
    let id = this.state.classrooms.find(
      (element) =>
        parseInt(element.classroomNumber) === parseInt(selectedClassroom)
    ).classroomId;
    this.setState({ selectedClassroom });
    this.props.setDestinationId(id);
  };

  render() {
    let { classes, classroomsNumber } = this.state;
    return (
      <div className="selection-container">
        <Selection data={classes} handleSelect={this.handleSelectClass} />
        <Selection
          data={classroomsNumber}
          handleSelect={this.handleSelectClassroom}
        />
      </div>
    );
  }
}

export default ClassoomAnnouncements;
