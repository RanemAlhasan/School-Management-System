import React, { Component } from "react";
import studentPic from "../../images/student.png";
import {
  getModifiedData,
  registerStudent,
} from "../../services/studentService";
import Student from "../Sign up/Student";
import { ToastContainer, toast } from "react-toastify";
import PeriodContext from "../../contexts/periodContext";

class NewStudent extends Component {
  static contextType = PeriodContext;

  customSubmit = async (account, classesWithId) => {
    if (
      !account["currentClass"] ||
      account["currentClass"] === "Current Class ?"
    ) {
      toast.error("Select a valid class");
      return;
    }
    if (account.parentEmail === account.email) {
      toast.error("Student and parent emails must be different");
      return;
    }
    let id = classesWithId.schoolClasses.find(
      (element) => element.class.name === account["currentClass"]
    ).id;
    let modifiedStd = getModifiedData(account, id);
    console.log(JSON.stringify(modifiedStd));
    try {
      await registerStudent(
        modifiedStd,
        this.context.account,
        this.context.siteName
      );
      toast.success("Student has been added successfully");
    } catch (error) {
      toast.error("Email is already in use");
    }
  };

  render() {
    return (
      <div id="add-common">
        <ToastContainer />
        <div id="common-info">
          <h4>Student information</h4>
          <Student customSubmit={this.customSubmit} />
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

export default NewStudent;
