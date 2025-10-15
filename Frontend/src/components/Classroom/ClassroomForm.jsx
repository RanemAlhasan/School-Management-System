import Joi from "joi-browser";
import React from "react";
import Form from "../Form";

class ClassroomForm extends Form {
  state = {
    account: {
      number: "",
      capacity: "",
    },
    errors: {
      number: "",
      capacity: "",
    },
  };

  schema = {
    capacity: Joi.number().min(1).allow("").optional(),
    number: Joi.number().min(0).allow("").optional(),
  };

  handleCompleteChange = (value, name) => {
    let number = name === "number" ? value : this.state.account.number;
    let capacity = name === "capacity" ? value : this.state.account.capacity;
    let account = { ...this.state.account };
    account[name] = value;
    this.props.handleCapacityChange(capacity, number, this.props.index);
    this.setState({ account });
  };

  render() {
    let { capacity, number } = this.state.account;
    let errors = this.state.errors;
    return (
      <div id="classroom-form">
        <div id="title">
          <span>{number ? number : "?"}</span>
        </div>
        <div id="form">
          {this.renderInput(
            "number",
            number,
            "Classroom number",
            errors.number,
            "number"
          )}
          {this.renderInput(
            "capacity",
            capacity,
            "Capacity",
            errors.capacity,
            "number"
          )}
        </div>
      </div>
    );
  }
}

export default ClassroomForm;
