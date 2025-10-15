import React, { Component } from "react";
import {
  decodeSubject,
  getGeneralCategories,
  getMySubjects,
} from "../../services/subjectsService";
import Selection from "../Selection";
import { decodeClasses, getMyClasses } from "../../services/classesService";
import PeriodContext from "../../contexts/periodContext";
import { ToastContainer } from "react-toastify";
import SubjectInfo from "./subjectInfo";

class getSubjects extends Component {
  static contextType = PeriodContext;

  state = {
    semesters: ["First semester", "Second semester"],
    categoriesName: [],
    classes: [],
    heading: "",
    headingOfSemester: "",
    subjects: [],
  };

  componentDidMount = async () => {
    try {
      let { data } = await getGeneralCategories();
      let categoriesName = data.map((element) => element.name);
      try {
        let { data } = await getMyClasses(
          this.context.account,
          this.context.siteName
        );
        let classes = decodeClasses(data);
        let [semesters] = [this.state.semesters];
        try {
          let { data: secondData } = await getMySubjects(
            this.context.account,
            classes[0],
            semesters[0], 
            this.context.siteName
          );
          let result = decodeSubject(secondData, categoriesName);
          this.setState({
            subjects: result,
            classes,
            heading: classes[0],
            headingOfSemester: semesters[0],
            categoriesName,
          });
        } catch (error) {}
        this.setState({
          classes,
          heading: classes[0],
          headingOfSemester: semesters[0],
          categoriesName,
        });
      } catch (error) {}
    } catch (error) {}
  };

  handleSemester = async (headingOfSemester) => {
    try {
      let { data } = await getMySubjects(
        this.context.account,
        this.state.heading,
        headingOfSemester,
        this.context.siteName
      );
      console.log(data);
      let result = decodeSubject(data, this.state.categoriesName);
      this.setState({ subjects: result, headingOfSemester });
    } catch (error) {}
    this.setState({ headingOfSemester });
  };

  handleSelect = async (heading) => {
    try {
      let { data } = await getMySubjects(
        this.context.account,
        heading,
        this.state.headingOfSemester,
        this.context.siteName
      );
      console.log(data);
      let result = decodeSubject(data, this.state.categoriesName);
      this.setState({ subjects: result, heading });
    } catch (error) {}
    this.setState({ heading });
  };

  renderSelection = () => {
    return this.state.classes.length ? (
      <Selection handleSelect={this.handleSelect} data={this.state.classes} />
    ) : null;
  };

  renderSelectionSemester = () => {
    return this.state.classes.length ? (
      <Selection
        handleSelect={this.handleSemester}
        data={this.state.semesters}
      />
    ) : null;
  };
  renderSubject = () => {
    if (this.state.classes.length && !this.state.subjects.length) {
      return <h1 id="empty">No subjects to show</h1>;
    }
    return <SubjectInfo info={this.state.subjects} />;
  };

  render() {
    let classesLength = this.state.classes.length;
    return (
      <div id="get-classrooms">
        <ToastContainer />
        {!classesLength && <h1 id="empty">Add your classes first</h1>}
        {this.renderSelection()}
        {this.renderSelectionSemester()}
        {this.renderSubject()}
      </div>
    );
  }
}

export default getSubjects;
