import React, { Component } from "react";
import CrudList from "../CrudList";
import { Redirect, Route, Switch } from "react-router";
import NewTeacher from "./NewTeachers";
import PeriodContext from "../../contexts/periodContext";
import ExistingTeacher from "./ExistingTeacher";

class AddStudents extends Component {
  static contextType = PeriodContext;

  state = {
    list: ["New teacher", "Existing teacher"],
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect
          to={`/school/${this.context.siteName}/teachers/Addteachers`}
        />
      );
    else
      return (
        <Redirect to={`/school/${this.context.siteName}/teachers/${type}`} />
      );
  };

  render() {
    let { siteName } = this.context;
    let type = this.props.match.params.type;

    return (
      <div id="addition">
        <h4>Choose addition method</h4>
        <CrudList
          list={this.state.list}
          baseURL={`/school/${siteName}/teachers/Addteachers`}
          type={type}
        />
        <Switch>
          <Route
            path="/school/:name/teachers/addteachers/newteacher"
            component={NewTeacher}
          />
          <Route
            path="/school/:name/teachers/addteachers/existingteacher"
            component={ExistingTeacher}
          />
          <Redirect
            to={`/school/${siteName}/teachers/addteachers/newteacher`}
          />
        </Switch>
      </div>
    );
  }
}

export default AddStudents;
