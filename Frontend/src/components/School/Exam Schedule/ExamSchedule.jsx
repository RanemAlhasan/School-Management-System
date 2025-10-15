import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import CrudList from "../../CrudList";
import SetExamSchedule from "./SetExamSchedule";
import PeriodContext from "../../../contexts/periodContext";
import ViewExamSchedule from "./ViewExamSchedule";

class ExamSchedule extends Component {
  static contextType = PeriodContext;

  state = {};

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect
          to={`/school/${this.context.siteName}/ExamSchedule/Setschedule`}
        />
      );
    else
      return (
        <Redirect
          to={`/school/${this.context.siteName}/ExamSchedule/${type}`}
        />
      );
  };

  render() {
    let { siteName } = this.context;
    let type = this.props.match.params.type;

    return (
      <React.Fragment>
        <CrudList
          list={["Set schedule", "View schedule"]}
          baseURL={`/school/${siteName}/ExamSchedule`}
          type={type}
        />
        <Switch>
          <Route
            path="/school/:name/ExamSchedule/Setschedule"
            component={SetExamSchedule}
          />
          <Route
            path="/school/:name/ExamSchedule/Viewschedule"
            component={ViewExamSchedule}
          />
          <Redirect to={`/school/${siteName}/ExamSchedule/Setschedule`} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default ExamSchedule;
