import React, { Component } from "react";
import teacherPic from "../../images/teacher.png";
import { registerTeacher } from "../../services/teacherService";
import Teacher from "../Sign up/Teacher";
import PeriodContext from "../../contexts/periodContext";
import { ToastContainer, toast } from "react-toastify";

class NewStudent extends Component {
  static contextType = PeriodContext;

  customSubmit = async (account) => {
    let years = this.context.account;
    try {
      await registerTeacher(years, account, this.context.siteName);
      toast.success("Teacher has been added successfully");
    } catch (error) {
      toast.error("Email is already in use");
    }
  };

  render() {
    return (
      <div id="add-common">
        <ToastContainer />
        <div id="common-info">
          <h4>Teacher information</h4>
          <Teacher complete={false} customSubmit={this.customSubmit} />
        </div>
        <div id="common-pic">
          <div id="image-container">
            <img alt="new teacher" src={teacherPic} />
          </div>
        </div>
      </div>
    );
  }
}

export default NewStudent;
