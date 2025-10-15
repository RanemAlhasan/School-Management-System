import React, { Component } from "react";
import studentPic from "../../images/student.png";
import PeriodContext from "../../contexts/periodContext";
import ExistingForm from "./ExistingForm";

class ExistingStudent extends Component {
  static contextType = PeriodContext;

  customSubmit = () => {};

  render() {
    return (
      <div id="add-common">
        <div id="common-info">
          <h4>Student information</h4>
          <ExistingForm />
        </div>
        <div id="common-pic">
          <div id="image-container">
            <img alt="new student" src={studentPic} />
          </div>
        </div>
      </div>
    );
  }
}

export default ExistingStudent;
