import Joi from "joi-browser";
import React from "react";
import Form from "../Form";
import periodContext from "../../contexts/periodContext";
import { ToastContainer, toast } from "react-toastify";
import { registerExistingTeacher } from "../../services/teacherService";

class ExistingForm extends Form {
  static contextType = periodContext;

  state = {
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

  completeSubmit = async () => {
    let { account } = this.state;

    let teacher = {
      accountId: account.uniqueId,
      email: account.email,
    };

    try {
      await registerExistingTeacher(
        teacher,
        this.context.account,
        this.context.siteName
      );
      toast.success("Teacher has been added successfully");
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("Invalid teacher information");
      else if (error.response && error.response.status === 401)
        toast.error("Teacher is already registered in the school");
    }
  };

  render() {
    let { email, uniqueId } = this.state.account;
    let { errors } = this.state;

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
        {this.renderSubmitButton("Register")}
      </form>
    );
  }
}

export default ExistingForm;
