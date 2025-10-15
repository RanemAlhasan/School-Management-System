import Joi from "joi-browser";
import React from "react";
import Form from "../Form";
import periodContext from "../../contexts/periodContext";
import Selection from "../Selection";
import { getMyClasses } from "../../services/classesService";
import { ToastContainer, toast } from "react-toastify";
import { registerExistingStudent } from "../../services/studentService";

class ExistingForm extends Form {
  static contextType = periodContext;

  state = {
    classes: [],
    selectedClassId: -1,

    account: {
      email: "",
      uniqueId: "",
    },
    errors: {
      email: "",
      uniqueId: "",
    },
  };

  schema = {
    email: Joi.string().email().required().label("email"),
    uniqueId: Joi.string().required().label("unique id"),
  };

  componentDidMount = async () => {
    // Years

    let { data } = await getMyClasses(
      this.context.account,
      this.context.siteName
    );
    this.setState({ classes: data.schoolClasses });
  };

  completeSubmit = async () => {
    let { selectedClassId, account } = this.state;
    if (selectedClassId === -1) {
      toast.error("Select a valid class");
      return;
    }

    let student = {
      id: account.uniqueId,
      email: account.email,
      schoolClassId: selectedClassId,
    };

    try {
      await registerExistingStudent(
        student,
        this.context.account,
        this.context.siteName
      );
      toast.success("Student has been added successfully");
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("Invalid student information");
      else if (error.response && error.response.status === 401)
        toast.error("Student is already registered in a school");
    }
  };

  selectClass = (selectedClass) => {
    let selectedClassId;
    if (selectedClass === "Current Class ?") selectedClassId = -1;
    else {
      let { classes } = this.state;
      selectedClassId = classes.find(
        (element) => element.class.name === selectedClass
      ).id;
    }
    this.setState({ selectedClassId });
  };

  render() {
    let { email, uniqueId } = this.state.account;
    let { errors, classes } = this.state;
    let classesNames = classes.map((element) => element.class.name);
    classesNames = ["Current Class ?", ...classesNames];

    return (
      <form onSubmit={this.handleSubmit} autoComplete="off">
        <ToastContainer />
        {this.renderInput("email", email, "Email", errors.email, "email")}
        {this.renderPassword(
          "uniqueId",
          uniqueId,
          "ID Number",
          errors.uniqueId
        )}
        <Selection data={classesNames} handleSelect={this.selectClass} />
        {this.renderSubmitButton("Register")}
      </form>
    );
  }
}

export default ExistingForm;
