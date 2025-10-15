import { Component } from "react";
import Joi from "joi-browser";
import Input from "./Input";
import Password from "./Password";
import Date from "./Date";
import { getPaginatedArray } from "../services/pagination";
import { replaceEverything } from "../services/dateCompare";

class Form extends Component {
  state = {};
  schema = {};

  handlePasswordMatch = (currentTarget, errors) => {
    let { name, value } = currentTarget;
    if (name === "confirmPassword") {
      if (
        errors["confirmPassword"] ||
        value === this.state.account["password"]
      ) {
        return errors;
      } else {
        errors["confirmPassword"] = "passwords don't match";
      }
    } else if (name === "password") {
      if (this.state.account["confirmPassword"]) {
        if (this.state.account["confirmPassword"] === value) {
          errors["confirmPassword"] = "";
        } else {
          errors["confirmPassword"] = "passwords don't match";
        }
      }
    }
    return errors;
  };

  handleChange = ({ currentTarget }) => {
    let account = { ...this.state.account };
    account[currentTarget.name] = currentTarget.value;

    let error = this.validateOneField(currentTarget);
    let errors = { ...this.state.errors };
    errors[currentTarget.name] = error;

    if ("confirmPassword" in account) {
      errors = this.handlePasswordMatch(currentTarget, errors);
    }

    this.setState({ account, errors });
    this.handleCompleteChange(currentTarget.value, currentTarget.name);
  };

  renderDate = (name, value, placeholder, error) => {
    return (
      <Date
        name={name}
        value={value}
        handleChange={this.handleChange}
        placeholder={placeholder}
        error={error}
      />
    );
  };

  passwordMatch = () => {
    let values = { ...this.state.account };
    if ("confirmPassword" in values && values["confirmPassword"]) {
      if (values["confirmPassword"] !== values["password"]) {
        return [true, "passwords don't match"];
      }
    }
    return false;
  };

  completeSubmit = () => {};

  handleSubmit = (event) => {
    event.preventDefault();
    let errors = this.validate();
    let result = this.passwordMatch();
    if (result[0]) errors["confirmPassword"] = result[1];
    if (Object.keys(errors).length !== 0) {
      this.setState({ errors });
      return;
    }
    this.completeSubmit();
  };

  nextPage = (index) => {
    if (index < this.state.currentIndex) return true;
    let paginatedArray = getPaginatedArray(
      this.state.paginate,
      this.state.currentIndex,
      5
    );

    let errors = this.validate();
    let result = this.passwordMatch();
    let canMove = true;
    if (result[0]) errors["confirmPassword"] = result[1];
    if (Object.keys(errors).length !== 0) {
      for (let error in errors)
        if (paginatedArray.find((element) => element === error)) {
          canMove = false;
          break;
        }
      if (!canMove) {
        this.setState({ errors });
        return false;
      }
    }
    this.setState({ errors: {} });
    return true;
  };

  renderSubmitButton = (text) => {
    return <button type="submit">{text}</button>;
  };

  renderInput = (name, value, placeholder, error, type = "text") => {
    return (
      <Input
        type={type}
        name={name}
        handleChange={this.handleChange}
        placeholder={placeholder}
        value={value}
        error={error}
      />
    );
  };

  handleCompleteChange = () => {};

  renderPassword = (name, value, placeholder, error) => {
    return (
      <Password
        name={name}
        value={value}
        placeholder={placeholder}
        handleChange={this.handleChange}
        error={error}
      />
    );
  };

  show = (name) => {
    return this.state.paginatedArray.find((element) => name === element);
  };

  checkNext = (startIndex, endIndex) => {
    for (let i = startIndex; i < endIndex; i++) {
      let paginatedArray = getPaginatedArray(this.state.paginate, i, 5);

      let errors = this.validate();
      let result = this.passwordMatch();
      let canMove = true;
      if (result[0]) errors["confirmPassword"] = result[1];
      if (Object.keys(errors).length !== 0) {
        for (let error in errors)
          if (paginatedArray.find((element) => element === error)) {
            canMove = false;
            break;
          }
        if (!canMove) {
          this.setState({ errors });
          return i;
        }
      }
    }
    return -1;
  };

  handleClick = (index) => {
    let paginatedArray = getPaginatedArray(this.state.paginate, index, 5);
    let result = this.nextPage(index);
    if (result) {
      if (index - this.state.currentIndex > 1) {
        let result = this.checkNext(this.state.currentIndex + 1, index);
        index = result === -1 ? index : result;
        if (index !== -1)
          paginatedArray = getPaginatedArray(this.state.paginate, index, 5);
      }
      this.setState({ paginatedArray, currentIndex: index, activePage: index });
    }
  };

  validateOneField = (currentTarget) => {
    let validate = Joi.validate(
      currentTarget.value,
      this.schema[currentTarget.name],
      { abortEarly: false }
    );

    let error = validate.error;

    return error
      ? replaceEverything(error.details[0].message, '"', "").replace(
          "value",
          currentTarget.name
        )
      : "";
  };

  validate = () => {
    let validate = Joi.validate(this.state.account, this.schema, {
      abortEarly: false,
    });

    let errors = {};

    if (validate.error) {
      let details = validate.error.details;

      for (let error of details) {
        if (!errors[error.path]) {
          errors[error.path] = replaceEverything(error.message, '"', "");
        }
      }
    }
    return errors;
  };
}

export default Form;
