import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import PeriodContext from "../../contexts/periodContext";
import { layoffStudent } from "../../services/studentService";

class LayOffTeacher extends Component {
  static contextType = PeriodContext;

  state = {
    students: [],

    searchStudent: "",
  };

  componentDidMount = async () => {
    // Years

    // Students
    let students = []; /*await showStudentsInClass(
      years,
      selectedClass,
      this.context.siteName
    );*/

    this.setState({ students });
  };

  handleNameChange = ({ currentTarget }) => {
    this.setState({ searchStudent: currentTarget.value });
  };

  layOffStudent = async (studentId, studentName) => {
    try {
      await layoffStudent(
        studentId,
        this.context.account,
        this.context.siteName
      );
      toast.success(`${studentName} has been laid off successfully`);
    } catch (error) {}
  };

  renderStudents = () => {
    let { students } = this.state;
    students = students.filter((student) =>
      student.name
        .toLowerCase()
        .includes(this.state.searchStudent.toLocaleLowerCase())
    );

    return (
      <div id="info-container">
        {students.map((element) => {
          return (
            <div className="info" key={element.email}>
              <div className="title">
                <i className="fas fa-door-open" />
              </div>
              <div className="element">
                <p>{element.name}</p>
                <button
                  onClick={() =>
                    this.layOffStudent(element.studentId, element.name)
                  }
                >
                  Lay Off
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    let { searchStudent } = this.state;

    return (
      <div id="layoff">
        <ToastContainer />
        <input
          type="search"
          value={searchStudent}
          placeholder="Search Student"
          onChange={this.handleNameChange}
        />
        {this.renderStudents()}
      </div>
    );
  }
}

export default LayOffTeacher;
