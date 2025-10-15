import Joi from "joi-browser";
import React from "react";
import {
  getDays,
  getSchoolInfo,
  sendSchoolInfo,
} from "../services/schoolService";
import Form from "./Form";
import { ToastContainer, toast } from "react-toastify";
import Days from "./School/Days";
import PeriodContext from "../contexts/periodContext";

class SchoolInfo extends Form {
  static contextType = PeriodContext;

  state = {
    account: {
      startTime: "",
      numOfBreaks: "",
      breakDuration: "",
      sessionDuration: "",
    },
    errors: {
      startTime: "",
      numOfBreaks: "",
      breakDuration: "",
      sessionDuration: "",
    },
    days: [],
    daysNames: [],
    checkedDays: [],
  };

  schema = {
    startTime: Joi.string().required().label("start time"),
    numOfBreaks: Joi.number().min(1).required().label("break frequency"),
    breakDuration: Joi.number().min(1).required().label("break duration"),
    sessionDuration: Joi.number().min(1).required().label("session duration"),
  };

  componentDidMount = async () => {
    let days = await getDays();
    let daysNames = days.map((element) => element.name);
    console.log(daysNames);
    let generalInfo = await getSchoolInfo(
      this.context.account,
      this.context.siteName
    );
    let {
      startTime,
      breakDuration,
      breakFrequency,
      sessionDuration,
      activeDays,
    } = generalInfo;

    let account = {
      startTime: startTime ? startTime : "",
      breakDuration: breakDuration ? breakDuration : "",
      sessionDuration: sessionDuration ? sessionDuration : "",
      numOfBreaks: breakFrequency ? breakFrequency : "",
    };

    let checkedDays = activeDays
      ? activeDays.map(
          (element) => days.find((item) => item.id === element).name
        )
      : [];

    this.setState({ days, daysNames, account, checkedDays });
  };

  completeSubmit = async () => {
    let years = this.context.account;
    let { siteName } = this.context;

    if (!this.state.checkedDays.length)
      toast.error("Active days must be specified");
    else {
      let days = this.state.checkedDays.map((element) => {
        let id = this.state.days.find((item) => item.name === element).id;
        return id;
      });
      try {
        await sendSchoolInfo(this.state.account, days, years, siteName);
        toast.success("School info has been submitted successfully");
      } catch (error) {}
    }
  };

  handleDaySelect = (day) => {
    let checkedDays = [...this.state.checkedDays];
    if (checkedDays.find((element) => element === day)) {
      checkedDays = checkedDays.filter((element) => element !== day);
    } else checkedDays.push(day);
    this.setState({ checkedDays });
  };

  determineActive = (day) => {
    return this.state.checkedDays.find((element) => element === day)
      ? true
      : false;
  };

  render() {
    let { startTime, breakDuration, numOfBreaks, sessionDuration } =
      this.state.account;
    let errors = this.state.errors;
    console.log(this.state.daysNames);

    return (
      <div id="school-info">
        <ToastContainer />
        <form onSubmit={this.handleSubmit}>
          <h4>Start Time</h4>
          {this.renderInput(
            "startTime",
            startTime,
            "Start Time",
            errors.startTime,
            "time"
          )}
          <h4>Active days</h4>
          <div id="days">
            {this.state.daysNames.map((day) => (
              <Days
                key={day}
                active={this.determineActive(day)}
                item={day}
                handleClick={() => {
                  this.handleDaySelect(day);
                }}
              />
            ))}
          </div>
          <h4>Session duration</h4>
          {this.renderInput(
            "sessionDuration",
            sessionDuration,
            "Session Duration (minutes)",
            errors.sessionDuration,
            "number"
          )}
          <h4>Break frequency</h4>

          {this.renderInput(
            "numOfBreaks",
            numOfBreaks,
            "Break Frequency",
            errors.numOfBreaks,
            "number"
          )}
          <h4>Break duration</h4>

          {this.renderInput(
            "breakDuration",
            breakDuration,
            "Break Duration (minutes)",
            errors.breakDuration,
            "number"
          )}
          {this.renderSubmitButton("Submit")}
        </form>
      </div>
    );
  }
}

export default SchoolInfo;
