import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router";
import CrudList from "../CrudList";
import SortStudetnsAutomatically from "./SortStudentsAutomatically";
import SortStudentsManually from "./SortStudentsManually";
import PeriodContext from "../../contexts/periodContext";

class SortStudents extends Component {
  static contextType = PeriodContext;

  state = {
    list: ["Sort manually", "Sort automatically"],
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect
          to={`/school/${this.context.siteName}/sortstudents/sortmanually`}
        />
      );
    else
      return (
        <Redirect
          to={`/school/${this.context.siteName}/sortstudents/${type}`}
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
          baseURL={`/school/${siteName}/SortStudents`}
          type={type}
        />
        <Switch>
          <Route
            path={`/school/${siteName}/sortstudents/sortmanually`}
            component={SortStudentsManually}
          />
          <Route
            path={`/school/${siteName}/sortstudents/sortautomatically`}
            component={SortStudetnsAutomatically}
          />
          <Redirect to={`/school/${siteName}/sortstudents/sortmanually`} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default SortStudents;
