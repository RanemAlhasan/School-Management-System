import React, { Component } from "react";
import { getPaginatedStudents } from "../../services/pagination";
import StudentContext from "../../contexts/studentContext";
import SetMarkTable from "./SetMarkTable";
import Selection from "../Selection";

class SetStudentsMark extends Component {
  static contextType = StudentContext;

  state = {
    header: ["Student Name", "Student Mark"],
    active: 0,
    list: [5, 10, 15, 25, 50],
    pageSize: 5,
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

  render() {
    let students = this.context.students;
    return (
      <React.Fragment>
        <SetMarkTable
          header={this.state.header}
          body={getPaginatedStudents(
            students,
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
          <button onClick={this.context.handleSendMarks}>Set Marks</button>
          <button onClick={this.handleNext}>Next</button>
        </div>
      </React.Fragment>
    );
  }
}

export default SetStudentsMark;
