import React, { Component } from "react";
import { getPaginatedStudents } from "../../services/pagination";
import StudentContext from "../../contexts/studentContext";
import Selection from "../Selection";
import GetMarksTable from "./GetMarkTable";

class SetStudentsMark extends Component {
  static contextType = StudentContext;
  state = {
    active: 0,
    list: [5, 10, 15, 25, 50],
    pageSize: 5,
    students: [],
    viewArray: [],
    markSortType: "DES",
    nameSortType: "ACS",
  };

  componentDidMount = () => {
    let students = this.context.students;
    let viewArray = students.sort((a, b) =>
      a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    );
    this.setState({ students, viewArray });
  };

  handlePrevious = () => {
    let active = this.state.active - 1;
    this.setState({ active: active < 0 ? 0 : active });
  };

  handleNext = () => {
    let active = this.state.active + 1;
    let compare = Math.ceil(this.context.students.length / this.state.pageSize);
    if (compare > active) this.setState({ active: active });
  };

  handlePageSize = (pageSize) => {
    this.setState({ pageSize, active: 0 });
  };

  handleMarkSort = () => {
    if (this.state.markSortType === "DES") {
      this.context.handleMarkSort("DES");
      this.setState({ markSortType: "ACS" });
    } else {
      this.context.handleMarkSort("ACS");
      this.setState({ markSortType: "DES" });
    }
  };

  handleNameSort = () => {
    if (this.state.nameSortType === "DES") {
      this.context.handleNameSort("DES");
      this.setState({ nameSortType: "ACS" });
    } else {
      this.context.handleNameSort("ACS");
      this.setState({ nameSortType: "DES" });
    }
  };

  render() {
    return (
      <React.Fragment>
        <GetMarksTable
          header={this.state.header}
          handleMarkSort={() => this.handleMarkSort(this.context.students)}
          handleNameSort={this.handleNameSort}
          students={getPaginatedStudents(
            this.context.students,
            this.state.active,
            this.state.pageSize
          )}
        />
        <div className="bottom-container">
          <button onClick={this.handlePrevious}>Prev</button>
          <Selection
            data={this.state.list}
            handleSelect={this.handlePageSize}
          />
          <button onClick={this.handleNext}>Next</button>
        </div>
      </React.Fragment>
    );
  }
}

export default SetStudentsMark;
