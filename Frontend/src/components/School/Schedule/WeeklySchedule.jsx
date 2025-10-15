import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router";
import CrudList from "../../CrudList";
import PeriodContext from "../../../contexts/periodContext";
import SetSchedule from "./SetSchedule";
import ViewSchedule from "./ViewSchdule";

class WeeklySchedule extends Component {
  static contextType = PeriodContext;

  state = {
    list: ["Set schedule", "View schedule"],
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect
          to={`/school/${this.context.siteName}/weeklyschedule/setschedule`}
        />
      );
    else
      return (
        <Redirect
          to={`/school/${this.context.siteName}/weeklyschedule/${type}`}
        />
      );
  };

  render() {
    let { siteName } = this.context;
    let type = this.props.match.params.type;

    return (
      <React.Fragment>
        <CrudList
          list={this.state.list}
          baseURL={`/school/${siteName}/weeklyschedule`}
          type={type}
        />
        <Switch>
          <Route
            path="/school/:name/weeklyschedule/setschedule"
            component={SetSchedule}
          />
          <Route
            path="/school/:name/weeklyschedule/viewschedule"
            component={ViewSchedule}
          />
          <Redirect to={`/school/${siteName}/weeklyschedule/setschedule`} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default WeeklySchedule;
