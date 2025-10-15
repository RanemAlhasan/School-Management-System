import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import PeriodContext from "../../contexts/periodContext";
import {
  sendAutomaticSortedStudents,
  showClassroomsInSort,
} from "../../services/classroomsService";
import { showClasses } from "../../services/marksServices";
import { getStudentsCount } from "../../services/sortStudentsAutomatically";
import { showStudentsInClass } from "../../services/studentService";
import Selection from "../Selection";
import SortTable from "./SortTable";

class SortStudetnsAutomatically extends Component {
  static contextType = PeriodContext;

  state = {
    classes: [],
    students: [],
    classrooms: [],
    classroomStudentCount: [],
    sortTypes: ["Sort Alphabetically", "Sort By Precedence"],

    selectedClass: "",
    sortType: "",
  };

  componentDidMount = async () => {
    // Years
    let years = this.context.account;

    let classes = await showClasses(years, this.context.siteName);
    let selectedClass = classes[0];

    let classrooms = await showClassroomsInSort(
      years,
      selectedClass,
      this.context.siteName
    );

    let students = await showStudentsInClass(
      years,
      selectedClass,
      this.context.siteName
    );

    let sortType = this.state.sortTypes[0];

    let classroomStudentCount = getStudentsCount(students, classrooms);

    this.setState({
      classes,
      students,
      classrooms,
      classroomStudentCount,
      selectedClass: selectedClass ? selectedClass : "None",
      sortType,
    });
  };

  // Handle Select Class
  handleSelectClass = async (selectedClass) => {
    let years = this.context.account;
    let students = await showStudentsInClass(
      years,
      selectedClass,
      this.context.siteName
    );
    let classrooms = await showClassroomsInSort(
      years,
      selectedClass,
      this.context.siteName
    );
    let classroomStudentCount = getStudentsCount(students, classrooms);
    this.setState({
      students,
      classrooms,
      classroomStudentCount,
      selectedClass,
    });
  };

  // Handle Select Type
  handleSelectType = (sortType) => {
    this.setState({ sortType });
  };

  getSortedStudents = () => {
    let students = this.state.students;
    if (this.state.sortType === "Sort Alphabetically") {
      students = students.sort((first, second) =>
        first.name.toLowerCase() > second.name.toLowerCase() ? 1 : -1
      );
    } else if (this.state.sortType === "Sort By Precedence") {
      students = students.sort((first, second) => {
        let firstDate = new Date(first.createdDate).getTime();
        let secondDate = new Date(second.createdDate).getTime();
        return firstDate > secondDate ? 1 : -1;
      });
    }
    return students;
  };

  sendSortType = async () => {
    let { sortType } = this.state;
    if (sortType === "Sort Alphabetically") sortType = "alpha";
    if (sortType === "Sort By Precedence") sortType = "preced";
    try {
      await sendAutomaticSortedStudents(
        this.context.account,
        this.state.selectedClass,
        sortType,
        this.state.classroomStudentCount,
        this.context.siteName
      );
      toast.success("Students have been sorted successfully");
    } catch (error) {
      console.log("hi");
    }
  };

  render() {
    let { students } = this.state;
    console.log(students);
    return (
      <React.Fragment>
        <ToastContainer />
        <div className="selection-sort">
          <div className="selection-sort-part">
            <h4>Select a class</h4>
            <Selection
              data={this.state.classes}
              handleSelect={this.handleSelectClass}
            />
          </div>

          <div className="selection-sort-part">
            <h4>Select sort type</h4>
            <Selection
              data={this.state.sortTypes}
              handleSelect={this.handleSelectType}
            />
          </div>
        </div>
        <SortTable
          students={this.getSortedStudents()}
          classrooms={this.state.classroomStudentCount}
        />
        {students.length !== 0 && (
          <button className="sort" onClick={this.sendSortType}>
            Sort Students
          </button>
        )}
      </React.Fragment>
    );
  }
}

export default SortStudetnsAutomatically;
