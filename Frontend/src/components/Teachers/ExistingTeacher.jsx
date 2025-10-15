import React, { Component } from "react";
import studentPic from "../../images/teacher.png";
import PeriodContext from "../../contexts/periodContext";
import ExistingForm from "./ExistingForm";

class ExistingTeacher extends Component {
  static contextType = PeriodContext;

  customSubmit = () => {};

  render() {
    return (
      <div id="add-common">
        <div id="common-info">
          <h4>Teacher information</h4>
          <ExistingForm />
        </div>
        <div id="common-pic">
          <div id="image-container">
            <img alt="new teacher" src={studentPic} />
          </div>
        </div>
      </div>
    );
  }
}

export default ExistingTeacher;
