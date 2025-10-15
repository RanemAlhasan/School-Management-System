import React from "react";
import Form from "../Form";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import { signUpStudent } from "../../services/studentService";
import { getPaginatedArray } from "../../services/pagination";
import Paginate from "../Pagintate";
import { decodeClasses, getMyClasses } from "../../services/classesService";
import Selection from "../Selection";
import PeriodContext from "../../contexts/periodContext";
import { getUser, saveJwt } from "../../services/loginService";

class Student extends Form {
  static contextType = PeriodContext;

  state = {
    account: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      fatherName: "",
      motherName: "",
      address: "",
      phoneNumber: "",
      lastSchoolAttended: "",
      currentClass: "",

      parentEmail: "",
      parentPassword: "",
      parentPhoneNumber: "",
    },
    errors: {
      firstName: "",
      lastName: "",
      email: "",
      parentEmail: "",
      parentPassword: "",
      parentPhoneNumber: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      address: "",
      fatherName: "",
      phoneNumber: "",
      motherName: "",
      lastSchoolAttended: "",
      currentClass: "",
    },
    paginate: [
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
      "birthDate",
      "address",
      "phoneNumber",
      "fatherName",
      "motherName",
      "parentEmail",
      "parentPassword",
      "parentPhoneNumber",
      "lastSchoolAttended",
      "currentClass",
    ],
    paginatedArray: [],
    currentIndex: 0,
    activePage: 0,
    classes: [],
    classesWithId: [],
    heading: "",
  };

  componentDidMount = async () => {
    let paginatedArray = getPaginatedArray(
      this.state.paginate,
      this.state.currentIndex,
      5
    );
    try {
      let { data } = await getMyClasses(
        this.context.account,
        this.context.siteName
      );
      let classes = decodeClasses(data);
      let newArray = ["Current Class ?", ...classes];
      this.setState({ paginatedArray, classes: newArray, classesWithId: data });
    } catch (error) {
      this.setState({ paginatedArray });
    }
  };

  schema = {
    firstName: Joi.string().required().label("first name"),
    lastName: Joi.string().required().label("last name"),
    email: Joi.string().email().required().label("email"),
    parentEmail: Joi.string().email().required().label("parent email"),
    parentPhoneNumber: Joi.number().required().label("parent phone number"),
    password: Joi.string().min(8).required().label("password"),
    confirmPassword: Joi.string().required().label("confirm password"),
    parentPassword: Joi.string().min(8).required().label("password"),
    birthDate: Joi.string().required().label("birth date"),
    address: Joi.string().required().label("address"),
    fatherName: Joi.string().alphanum().required().label("father name"),
    motherName: Joi.string().required().label("mother name"),
    phoneNumber: Joi.number().required().label("phone number"),
    lastSchoolAttended: Joi.string().required().label("previous school"),
    currentClass: Joi.allow("").optional(),
  };

  customValidation = () => {
    let errors = { ...this.state.errors };
    errors["confirmPassword"] = "passwords don't match";
    this.setState({ errors });
  };

  completeSubmit = async () => {
    if (this.props.customSubmit) {
      this.props.customSubmit(this.state.account, this.state.classesWithId);
      return;
    }
    try {
      let { data } = await signUpStudent(this.state.account);
      saveJwt(data.token);
      let user = getUser();
      window.location = `/${user.user}/${user.siteName}`;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        let errors = { ...this.state.errors };
        errors["email"] = "account already exists";
        this.setState({ errors });
      }
    }
  };

  handleSelect = (element) => {
    let account = { ...this.state.account };
    account["currentClass"] = element;
    this.setState({ account, heading: element });
  };

  render() {
    let {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      birthDate,
      address,
      fatherName,
      motherName,
      parentEmail,
      parentPassword,
      phoneNumber,
      parentPhoneNumber,
      lastSchoolAttended,
    } = this.state.account;

    let { errors } = this.state;

    let number = Math.ceil(Object.keys(this.state.account).length / 5);
    let { currentIndex } = this.state;

    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit} autoComplete="off">
          {this.show("firstName") &&
            this.renderInput(
              "firstName",
              firstName,
              "First Name",
              errors.firstName
            )}

          {this.show("lastName") &&
            this.renderInput(
              "lastName",
              lastName,
              "Last Name",
              errors.lastName
            )}

          {this.show("email") &&
            this.renderInput("email", email, "Email", errors.email, "email")}

          {this.show("password") &&
            this.renderPassword(
              "password",
              password,
              "Password",
              errors.password
            )}

          {this.show("confirmPassword") &&
            this.renderPassword(
              "confirmPassword",
              confirmPassword,
              "Confirm Password",
              errors.confirmPassword
            )}

          {this.show("birthDate") &&
            this.renderDate(
              "birthDate",
              birthDate,
              "Birth Date",
              errors.birthDate
            )}

          {this.show("address") &&
            this.renderInput("address", address, "Address", errors.address)}

          {this.show("phoneNumber") &&
            this.renderInput(
              "phoneNumber",
              phoneNumber,
              "Phone Number",
              errors.phoneNumber
            )}

          {this.show("fatherName") &&
            this.renderInput(
              "fatherName",
              fatherName,
              "Father Name",
              errors.fatherName
            )}

          {this.show("motherName") &&
            this.renderInput(
              "motherName",
              motherName,
              "Mother Name",
              errors.motherName
            )}

          {this.show("parentEmail") &&
            this.renderInput(
              "parentEmail",
              parentEmail,
              "Parent Email",
              errors.parentEmail,
              "email"
            )}

          {this.show("parentPassword") &&
            this.renderPassword(
              "parentPassword",
              parentPassword,
              "Parent Account Password",
              errors.parentPassword
            )}

          {this.show("parentPhoneNumber") &&
            this.renderInput(
              "parentPhoneNumber",
              parentPhoneNumber,
              "Parent Phone Number",
              errors.parentPhoneNumber
            )}

          {this.show("lastSchoolAttended") &&
            this.renderInput(
              "lastSchoolAttended",
              lastSchoolAttended,
              "Previous School",
              errors.lastSchoolAttended
            )}

          {this.show("currentClass") && (
            <Selection
              data={this.state.classes}
              handleSelect={this.handleSelect}
              heading={this.state.heading}
            />
          )}

          {currentIndex === number - 1 && this.renderSubmitButton("Sign up")}
        </form>
        <Paginate
          active={this.state.activePage}
          number={number}
          handleClick={this.handleClick}
        />
        <Link id="back" to="/login">
          Already have an account ?
        </Link>
      </React.Fragment>
    );
  }
}

export default Student;
