import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import PeriodContext from "../../../contexts/periodContext";
import { getDefaultValues } from "../../../services/defaultContextValues";
import { getStudentTeachers } from "../../../services/studentService";
import Selection from "../../Selection";

class ShowStudentTeachers extends Component {
  static contextType = PeriodContext;

  state = {
    teachers: [],
    semesters: [1, 2],
  };

  componentDidMount = async () => {
    let type = this.props.parent ? "parent" : "student";

    let { account } = this.context;
    if (!account.startYear) {
      account = await getDefaultValues(account, type);
    }
    let teachers = await getStudentTeachers(account, 1, type);
    this.setState({ teachers });
  };

  renderStudents = () => {
    let { teachers } = this.state;
    return (
      <div id="info-container">
        {teachers.map((element) => {
          let subjects = "";
          subjects += element.subjects.map((element) => element);
          subjects = subjects.replace(",", ", ");
          return (
            <div className="info" key={element.email}>
              <div className="title">
                <i className="las la-star" />
              </div>
              <div className="element">
                <p>{element.name}</p>
                <p>Subjects :</p>
                <p>{subjects}</p>
                <a href={`mailto:${element.email}`}>{element.email}</a>
                <p>{element.phoneNumber}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  handleSelectSemester = async (selectedSemester) => {
    let type = this.props.parent ? "parent" : "student";

    let teachers = await getStudentTeachers(
      this.context.account,
      selectedSemester,
      type
    );
    this.setState({ teachers });
  };

  render() {
    return (
      <div id="get-students" className="student-teachers">
        <h4>Select a semester</h4>
        <Selection data={[1, 2]} handleSelect={this.handleSelectSemester} />
        <ToastContainer />
        {this.renderStudents()}
      </div>
    );
  }
}

export default ShowStudentTeachers;
