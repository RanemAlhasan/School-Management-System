import React, { Component } from "react";
import { showClasses, showClassrooms } from "../../../services/marksServices";
import Selection from "../../Selection";
import PeriodContext from "../../../contexts/periodContext";
import { getSchoolSchedule } from "../../../services/studentService";
import Schedule from "../../Students/StudentWebsite/Schedule";

class ViewSchedule extends Component {
  static contextType = PeriodContext;

  state = {
    classes: [],
    classrooms: [],
    semesters: [1, 2],
    schedule: [],

    selectedClass: "",
    selectedClassroom: "",
    selectedSemester: "",
  };

  componentDidMount = async () => {
    let years = this.context.account;
    let siteName = this.context.siteName;

    let classes = await showClasses(years, siteName);
    let selectedClass = classes[0];

    let classrooms = await showClassrooms(years, selectedClass, siteName);
    let selectedClassroom = classrooms[0];

    let selectedSemester = 1;

    this.setState({
      classes,
      classrooms,
      selectedClass,
      selectedClassroom,
      selectedSemester,
    });
  };

  handleSelectClass = async (selectedClass) => {
    let years = this.context.account;
    let siteName = this.context.siteName;

    let classrooms = await showClassrooms(years, selectedClass, siteName);
    let selectedClassroom = classrooms[0];

    this.setState({
      classrooms,
      selectedClass,
      selectedClassroom,
    });
  };

  handleSelectClassroom = (selectedClassroom) => {
    this.setState({ selectedClassroom });
  };

  handleSelectSemester = (selectedSemester) => {
    this.setState({ selectedSemester });
  };

  showSchedule = async () => {
    let years = this.context.account;
    let siteName = this.context.siteName;

    let { selectedClass, selectedClassroom, selectedSemester } = this.state;
    let schedule = await getSchoolSchedule(
      years,
      siteName,
      selectedClass,
      selectedClassroom,
      selectedSemester
    );
    this.setState({ schedule });
  };

  render() {
    let { classes, classrooms, semesters } = this.state;

    return (
      <div className="view-schedule">
        <div className="selection-container">
          <div>
            <h4>Select a class</h4>
            <Selection data={classes} handleSelect={this.handleSelectClass} />
          </div>
          <div>
            <h4>Select a classroom</h4>
            <Selection
              data={classrooms}
              handleSelect={this.handleSelectClassroom}
            />
          </div>
          <div>
            <h4>Select a semester</h4>
            <Selection
              data={semesters}
              handleSelect={this.handleSelectSemester}
            />
          </div>
        </div>
        <button onClick={this.showSchedule}>Show Schedule</button>
        <Schedule schedule={this.state.schedule} />
      </div>
    );
  }
}

export default ViewSchedule;
