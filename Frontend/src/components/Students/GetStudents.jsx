import React, { Component } from "react";
import periodContext from "../../contexts/periodContext";
import { ToastContainer } from "react-toastify";
import Selection from "../Selection";
import { decodeStudents, getMyStudents } from "../../services/studentService";
import { showClasses, showClassrooms } from "../../services/marksServices";

class GetStudents extends Component {
  static contextType = periodContext;

  state = {
    classes: [],
    classrooms: [],
    students: [],
    viewStudentsArray: [],

    selectedClass: "",
    selectedClassroom: "",

    search: "",
  };

  componentDidMount = async () => {
    let classes = await showClasses(
      this.context.account,
      this.context.siteName
    );
    classes = ["All", ...classes];
    let selectedClass = classes[0];

    let classrooms = await showClassrooms(
      this.context.account,
      selectedClass,
      this.context.siteName
    );
    classrooms = ["All", ...classrooms];
    let selectedClassroom = classrooms[0];

    let { data } = await getMyStudents(
      this.context.account,
      this.context.siteName
    );
    let students = decodeStudents(data);
    console.log(students);

    this.setState({
      classes,
      classrooms,
      students,
      selectedClass,
      selectedClassroom,
    });
  };

  handleSearchChange = ({ currentTarget }) => {
    this.setState({ search: currentTarget.value });
  };

  handleSelectClass = async (selectedClass) => {
    let classrooms = await showClassrooms(
      this.context.account,
      selectedClass,
      this.context.siteName
    );
    classrooms = ["All", ...classrooms];
    let selectedClassroom = classrooms[0];
    this.setState({ selectedClass, classrooms, selectedClassroom });
  };

  handleSelectClassroom = (selectedClassroom) => {
    this.setState({ selectedClassroom });
  };

  filterStudents = (students) => {
    if (!students.length) return students;
    let selectedClass = this.state.selectedClass;
    let selectedClassroom = this.state.selectedClassroom;

    if (selectedClass === "All") return students;

    if (selectedClassroom === "All")
      return students.filter((student) => student.className === selectedClass);

    if (selectedClass !== "All" && selectedClassroom !== "All") {
      students = students.filter(
        (student) => student.className === selectedClass
      );
      students = students.filter(
        (student) =>
          parseInt(student.classroomNumber) === parseInt(selectedClassroom)
      );
      return students;
    }
    return students;
  };

  renderStudents = () => {
    if (this.state.classes.length && !this.state.students.length) {
      return <h1 id="empty">No students to show</h1>;
    }

    let students = this.state.students;
    students = this.filterStudents(students);

    students = students.filter((student) =>
      student.name.toLowerCase().includes(this.state.search.toLocaleLowerCase())
    );

    return (
      <div id="info-container">
        {students.map((element) => {
          return (
            <div className="info" key={element.email}>
              <div className="title">
                <i className="las la-star" />
              </div>
              <div className="element">
                <p>{element.name}</p>
                <a href={`mailto:${element.email}`}>{element.email}</a>
                <p>{element.phoneNumber}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  renderCapacity = () => {
    let students = this.state.students;
    students = this.filterStudents(students);
    if (this.state.selectedClassroom === "All" || !students.length) return null;

    let className = students.length > students[0].capacity ? "red" : "green";
    return (
      <p className={className}>
        {students.length} students of capacity : {students[0].capacity}
      </p>
    );
  };

  renderHeading = () => {
    let classesNum = this.state.classes.length;
    if (!classesNum) return <h1 id="empty">Add your classes first</h1>;

    return (
      <React.Fragment>
        <div id="selection-container">
          <div className="selection-part">
            <h4>Select a class</h4>
            <Selection
              data={this.state.classes}
              handleSelect={this.handleSelectClass}
            />
          </div>
          <div className="selection-part">
            <h4>Select a classroom</h4>
            <Selection
              data={this.state.classrooms}
              heading={this.state.selectedClassroom}
              handleSelect={this.handleSelectClassroom}
            />
          </div>
          <div className="selection-part">
            <input
              type="search"
              value={this.state.search}
              placeholder="Search Student"
              onChange={this.handleSearchChange}
            />
          </div>
          <div className="selection-part">{this.renderCapacity()}</div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    console.log(this.state.selectedClassroom);
    return (
      <div id="get-students">
        <ToastContainer />
        {this.renderHeading()}
        {this.renderStudents()}
      </div>
    );
  }
}

export default GetStudents;
