import loginpic from "../images/Fingerprint-bro.png";
import React from "react";
import { Link, Route } from "react-router-dom";
import Form from "./Form";
import Joi from "joi-browser";
import { decodeJwt, login, saveJwt } from "../services/loginService";
import School from "./Sign up/School";

class Login extends Form {
  state = {
    account: { email: "", password: "" },
    errors: { email: "", password: "" },
  };

  schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  };

  completeSubmit = async () => {
    try {
      let { data } = await login(this.state.account);
      let decodedJwt = decodeJwt(data.token);
      console.log(decodedJwt);
      if (decodedJwt.user === "School") {
        saveJwt(data.token, decodedJwt.siteName);
        window.location = `/${decodedJwt.user}/${decodedJwt.siteName}`;
      } else if (decodedJwt.user === "Student") {
        saveJwt(data.token, `student-${decodedJwt.studentId}`);
        window.location = `/${decodedJwt.user}/${decodedJwt.studentId}`;
      } else if (decodedJwt.user === "Teacher") {
        saveJwt(data.token, `teacher-${decodedJwt.teacherId}`);
        window.location = `/${decodedJwt.user}/${decodedJwt.teacherId}`;
      } else if (decodedJwt.user === "InLocoParent") {
        saveJwt(data.token, `parent-${decodedJwt.inLocoParentId}`);
        window.location = `/parent/${decodedJwt.inLocoParentId}/${decodedJwt.studentId}`;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        let errors = { ...this.state.errors };
        errors["email"] = "failed to log in";
        errors["password"] = "failed to log in";
        this.setState({ errors });
      }
    }
  };

  render() {
    const { email, password } = this.state.account;
    const errors = this.state.errors;
    return (
      <div id="login">
        <Route path="/school/:name" component={School} />
        <div id="log-container">
          <div id="log-section">
            <h1>Log in</h1>
            <form onSubmit={this.handleSubmit} autoComplete="off">
              {this.renderInput("email", email, "Email", errors.email, "email")}
              {this.renderPassword(
                "password",
                password,
                "Password",
                errors.password
              )}
              {this.renderSubmitButton("Log in")}
              <Link className="button" to="/signup">
                Back to sign up
              </Link>
            </form>
          </div>
        </div>

        <div id="pic-section">
          <img src={loginpic} alt="login" />
        </div>
      </div>
    );
  }
}

export default Login;
