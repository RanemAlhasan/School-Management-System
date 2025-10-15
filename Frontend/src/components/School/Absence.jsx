import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { setAbsence } from "../../services/absenceService";
import CrudList from "../CrudList";
import AbsenceDate from "../Date";
import PeriodContext from "../../contexts/periodContext";
import StudentAbsence from "./StudentAbsence";
import { ToastContainer, toast } from "react-toastify";
import TeacherAbsence from "./TeacherAbsence";

class Absence extends Component {
  static contextType = PeriodContext;

  state = {
    list: ["Student", "Teacher"],
    date: "",
    reason: "",
    selectedDestination: "Student",
    destinationId: -1,
  };

  setDestinationId = (destinationId) => {
    this.setState({ destinationId });
  };

  handleInputChange = ({ currentTarget }) => {
    this.setState({ [currentTarget.name]: currentTarget.value });
  };

  customClick = (selectedDestination) => {
    this.setState({ selectedDestination, destinationId: -1 });
  };

  setAbsence = async () => {
    let years = this.context.account;
    let { date, reason, destinationId, selectedDestination } = this.state;

    if (destinationId === -1) {
      toast.error("Select a valid absent");
      return;
    }

    if (date === "") {
      toast.error("Select a valid date");
      return;
    }

    try {
      await setAbsence(
        years,
        date,
        reason,
        destinationId,
        selectedDestination,
        this.context.siteName
      );
      console.log("Hi");
      toast.success("Absence has been sent successfully");
    } catch (error) {}
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect
          to={`/school/${this.context.siteName}/absence/setAbsence/student`}
        />
      );
    else
      return (
        <Redirect
          to={`/school/${this.context.siteName}/absence/setAbsence/${type}`}
        />
      );
  };

  render() {
    let { date, reason } = this.state;
    let { siteName } = this.context;
    let type = this.props.match.params.type;

    return (
      <div id="absence">
        <ToastContainer />
        <CrudList
          baseURL={`/school/${siteName}/absence/setAbsence`}
          list={this.state.list}
          customClick={this.customClick}
          type={type}
        />
        <Switch>
          <Route
            path={`/school/${siteName}/absence/setAbsence/student`}
            render={(props) => (
              <StudentAbsence
                setDestinationId={this.setDestinationId}
                {...props}
              />
            )}
          />

          <Route
            path={`/school/${siteName}/absence/setAbsence/teacher`}
            render={(props) => (
              <TeacherAbsence
                setDestinationId={this.setDestinationId}
                {...props}
              />
            )}
          />
          <Redirect to={`/school/${siteName}/absence/setAbsence/student`} />
        </Switch>

        <AbsenceDate
          placeholder="Absence Date"
          name="date"
          value={date}
          handleChange={this.handleInputChange}
        />
        <input
          type="text"
          name="reason"
          placeholder="Absence Reason"
          value={reason}
          onChange={this.handleInputChange}
        />
        <button onClick={this.setAbsence}>Send</button>
      </div>
    );
  }
}

export default Absence;
