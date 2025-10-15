import React from "react";
import Form from "../Form";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import { signUpTeacher } from "../../services/teacherService";
import Paginate from "../Pagintate";
import { getPaginatedArray } from "../../services/pagination";

class Teacher extends Form {
  state = {
    account: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      address: "",
      birthDate: "",
      specification: "",
      graduationCollage: "",
      graduationYear: "",
    },
    errors: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      address: "",
      birthDate: "",
      specification: "",
      graduationCollage: "",
      graduationYear: "",
    },
    paginate: [
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
      "phoneNumber",
      "address",
      "birthDate",
      "specification",
      "graduationCollage",
      "graduationYear",
    ],
    paginatedArray: [],
    currentIndex: 0,
    activePage: 0,
  };

  componentDidMount = () => {
    let paginatedArray = getPaginatedArray(
      this.state.paginate,
      this.state.currentIndex,
      5
    );
    this.setState({ paginatedArray });
  };

  schema = {
    firstName: Joi.string().required().label("name"),
    lastName: Joi.string().required().label("name"),
    email: Joi.string().email().required().label("email"),
    password: Joi.string().min(8).required().label("password"),
    confirmPassword: Joi.string().required().label("confirm password"),
    phoneNumber: Joi.number().required().label("phone number"),
    address: Joi.string().required().label("address"),
    birthDate: Joi.string().required().label("birth date"),
    specification: Joi.string().required().label("spacification"),
    graduationCollage: Joi.string().required().label("graduation collage"),
    graduationYear: Joi.number()
      .min(1921)
      .max(new Date().getFullYear())
      .required()
      .label("graduation year"),
  };

  completeSubmit = async () => {
    if (this.props.customSubmit) {
      this.props.customSubmit(this.state.account);
      return;
    }
    try {
      await signUpTeacher(this.state.account);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        let errors = { ...this.state.errors };
        errors["email"] = "account already exists";
        this.setState({ errors });
      }
    }
  };

  render() {
    let {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      address,
      birthDate,
      specification,
      graduationCollage,
      graduationYear,
    } = this.state.account;

    let errors = this.state.errors;

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

          {this.show("phoneNumber") &&
            this.renderInput(
              "phoneNumber",
              phoneNumber,
              "Phone Number",
              errors.phoneNumber
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

          {this.show("specification") &&
            this.renderInput(
              "specification",
              specification,
              "Certification",
              errors.specification
            )}

          {this.show("graduationCollage") &&
            this.renderInput(
              "graduationCollage",
              graduationCollage,
              "Graduation College",
              errors.graduationCollage
            )}

          {this.show("graduationYear") &&
            this.renderInput(
              "graduationYear",
              graduationYear,
              "Graduation Year",
              errors.graduationYear
            )}

          {currentIndex === number - 1 && this.renderSubmitButton("Sign Up")}
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

export default Teacher;
