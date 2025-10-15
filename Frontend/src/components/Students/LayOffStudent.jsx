import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import { showClasses } from "../../services/marksServices";
import PeriodContext from "../../contexts/periodContext";
import Selection from "../Selection";
import {
  layoffStudent,
  showStudentsInClass,
} from "../../services/studentService";

class NewStudent extends Component {
  static contextType = PeriodContext;

  state = {
    students: [],
    classes: [],

    searchStudent: "",
    selectedClass: "",
  };

  componentDidMount = async () => {
    // Years
    let years = this.context.account;

    // Classes
    let classes = await showClasses(years, this.context.siteName);
    let selectedClass = classes[0];

    // Students
    let students = await showStudentsInClass(
      years,
      selectedClass,
      this.context.siteName
    );

    this.setState({
      classes,
      selectedClass: selectedClass ? selectedClass : "None",
      students,
    });
  };

  handleClassChange = async (selectedClass) => {
    let students = await showStudentsInClass(
      this.context.account,
      selectedClass,
      this.context.siteName
    );
    this.setState({ students, selectedClass });
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
                <i className="las la-door-open" />
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
    let { classes, searchStudent } = this.state;
    let { selectedClass } = this.state;

    return (
      <div id="layoff">
        <ToastContainer />
        <h4>Select student's class</h4>
        <Selection
          data={classes}
          handleSelect={this.handleClassChange}
          heading={selectedClass}
        />
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

export default NewStudent;

/**
 * <div id="common-info">
          <h4>Student Name</h4>
          
          <div id="student-info">
            <p>Abd Al Rahman Shebani</p>
            <button>Lay off</button>
          </div>
        </div>
        <div id="common-pic">
          <div id="image-container">
            <img alt="new student" src={studentPic} />
          </div>
        </div>
      </div>
 */
