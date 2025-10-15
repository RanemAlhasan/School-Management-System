import React from "react";
import { Route } from "react-router";
import Animate from "../Animate";
import Form from "../Form";
import School from "./School";
import signuppic from "../../images/signup.png";
import { Redirect } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

class Signup extends Form {
  state = {
    items: ["School", "Teacher", "Student"],
  };

  componentDidMount = () => {};

  showError = (errorMsg) => {
    toast.error(errorMsg.replace(".", ", "));
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <div id="signup">
          <div id="sign-section">
            <Animate text="Join Us" />
            <Route
              path="/signup/school"
              render={(props) => (
                <School showError={this.showError} {...props} />
              )}
            />
            <Redirect to="/signup/school" />
          </div>

          <div id="sign-pic-section">
            <div id="image-container">
              <img src={signuppic} alt="signup" />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Signup;
