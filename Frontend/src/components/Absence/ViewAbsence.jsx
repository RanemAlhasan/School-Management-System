import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import CrudList from "../CrudList";
import PeriodContext from "../../contexts/periodContext";
import ShowStudentAbsence from "./ShowStudentAbsence";
import ShowTeacherAbsence from "./ShowTeacherAbsence";

class SetAbsence extends Component {
  static contextType = PeriodContext;

  state = {};

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect
          to={`/school/${this.context.siteName}/absence/ViewAbsence/student`}
        />
      );
    else
      return (
        <Redirect
          to={`/school/${this.context.siteName}/absence/ViewAbsence/${type}`}
        />
      );
  };

  render() {
    let { siteName } = this.context;
    let type = this.props.match.params.type;
    console.log(type);

    return (
      <div id="absence">
        <CrudList
          baseURL={`/school/${siteName}/absence/viewAbsence`}
          list={["Student", "Teacher"]}
          type={type}
        />
        <Switch>
          <Route
            path={`/school/${siteName}/absence/ViewAbsence/student`}
            component={ShowStudentAbsence}
          />
          <Route
            path={`/school/${siteName}/absence/ViewAbsence/teacher`}
            component={ShowTeacherAbsence}
          />

          <Redirect to={`/school/${siteName}/absence/ViewAbsence/student`} />
        </Switch>
      </div>
    );
  }
}

export default SetAbsence;
