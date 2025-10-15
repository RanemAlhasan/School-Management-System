import React, { Component } from "react";
import {
  getMyTeachers,
  decodeTeachersAbsence,
  getTeacherAbsence,
  decodeMyTeachers,
} from "../../services/teacherService";
import PeriodContext from "../../contexts/periodContext";
import { ToastContainer } from "react-toastify";
import Selection from "../Selection";
import AbsenceTable from "../School/AbsenceTable";

class ShowTeacherAbsence extends Component {
  static contextType = PeriodContext;

  state = {
    teacherAbsece: [],
    search: "",
    teachers: [],
    teachersNames: [],
    teacherAbsenceToShow: [],
    selectedTeacher: "",
    helper: 0,
  };
  componentDidMount = async () => {
    try {
      let { data } = await getMyTeachers(
        this.context.account,
        this.context.siteName
      );
      let teachers = decodeMyTeachers(data);
      try {
        let { data } = await getTeacherAbsence(
          this.context.account,
          this.context.siteName
        );
        let result = decodeTeachersAbsence(data);
        let teachersNames = teachers.map((teacher) => teacher.name);
        let selectedTeacher = teachersNames[0];
        this.setState({
          teacherAbsece: result,
          teachers,
          teachersNames,
          selectedTeacher,
        });
      } catch (error) {
        this.setState({
          teachers,
        });
      }
    } catch (error) {}
  };

  handleSearchChange = ({ currentTarget }) => {
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
  };

  handleSelectTeacher = (selectedTeacher) => {
    this.setState({ selectedTeacher });
  };

  renderTeachersAbsence = () => {
    let teacherAbsece = this.state.teacherAbsece;
    let selectedTeacher = this.state.selectedTeacher;
    let teacherAbsenceToShow = teacherAbsece.filter(
      (teacher) => teacher.name === selectedTeacher
    );
    this.setState({
      teacherAbsenceToShow,
      helper: 1,
    });
  };

  renderInput = () => {
    if (!this.state.teachers.length) {
      return <h1 id="empty">No teacher to show</h1>;
    } else if (!this.state.teacherAbsece.length) {
      return <h1 id="empty">No teacher absence to show</h1>;
    }
    return (
      <div>
        <div className="selection-container">
          <input
            type="text"
            placeholder="Search teacher"
            onChange={this.handleSearchChange}
          />
          <Selection
            data={this.state.teachersNames}
            handleSelect={this.handleSelectTeacher}
            heading={this.state.selectedTeacher}
          />
        </div>
        <button onClick={this.renderTeachersAbsence}>Show</button>
      </div>
    );
  };

  show = () => {
    let helper = this.state.helper;
    if (!helper) {
      return null;
    }
    let teacherAbsence = [...this.state.teacherAbsenceToShow];
    if (!teacherAbsence.length) {
      return <h1 id="empty">The teacher has never been absent before</h1>;
    }
    let selectedTeacher = this.state.selectedTeacher;
    let props = {
      absences: teacherAbsence,
      name: selectedTeacher,
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

export default ShowTeacherAbsence;
