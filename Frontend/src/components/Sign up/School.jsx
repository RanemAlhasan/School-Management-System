import React from "react";
import Form from "../Form";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import { signUpSchool } from "../../services/schoolService";
import Paginate from "../Pagintate";
import { getPaginatedArray } from "../../services/pagination";
import { decodeJwt, saveJwt } from "../../services/loginService";

class School extends Form {
  state = {
    account: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      phoneNumber: "",
      facebookPage: "",
      openingDate: "",
      siteName: "",
    },
    errors: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      phoneNumber: "",
      facebookPage: "",
      openingDate: "",
      siteName: "",
    },
    paginate: [
      "name",
      "email",
      "password",
      "confirmPassword",
      "location",
      "phoneNumber",
      "facebookPage",
      "openingDate",
      "siteName",
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

  completeSubmit = async () => {
    try {
      let { data } = await signUpSchool(this.state.account);
      let decodedJwt = decodeJwt(data.token);
      saveJwt(data.token, decodedJwt.siteName);
      window.location = `/${decodedJwt.user}/${decodedJwt.siteName}`;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.props.showError(error.response.data);
      }
    }
  };

  schema = {
    name: Joi.string().required().label("name"),
    email: Joi.string().email().required().label("email"),
    password: Joi.string().min(8).required().label("password"),
    confirmPassword: Joi.string().required().label("confirm password"),
    location: Joi.string().required().label("location"),
    phoneNumber: Joi.number().required().label("phone number"),
    facebookPage: Joi.string()
      .uri()
      .label("facebook page")
      .allow("")
      .optional(),
    openingDate: Joi.string().required().label("opening date"),
    siteName: Joi.string().required().label("site name"),
  };

  render() {
    let {
      name,
      email,
      password,
      confirmPassword,
      location,
      phoneNumber,
      facebookPage,
      openingDate,
      siteName,
    } = this.state.account;

    let errors = this.state.errors;

    let { currentIndex } = this.state;
    let number = Math.ceil(Object.keys(this.state.account).length / 5);

    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit} autoComplete="off">
          {this.show("name") &&
            this.renderInput("name", name, "School Name", errors.name)}

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

          {this.show("location") &&
            this.renderInput("location", location, "Location", errors.location)}

          {this.show("phoneNumber") &&
            this.renderInput(
              "phoneNumber",
              phoneNumber,
              "Phone Number",
              errors.phoneNumber
            )}

          {this.show("facebookPage") &&
            this.renderInput(
              "facebookPage",
              facebookPage,
              "Facebook Page",
              errors.facebookPage
            )}

          {this.show("openingDate") &&
            this.renderDate(
              "openingDate",
              openingDate,
              "Opening Date",
              errors.openingDate
            )}

          {this.show("siteName") &&
            this.renderInput(
              "siteName",
              siteName,
              "Site Name",
              errors.siteName
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

export default School;
