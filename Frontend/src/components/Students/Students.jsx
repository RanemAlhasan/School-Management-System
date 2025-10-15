import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router";
import CrudList from "../CrudList";
import AddStudents from "./AddStudents";
import GetStudents from "./GetStudents";
import LayOffStudent from "./LayOffStudent";
import PeriodContext from "../../contexts/periodContext";
import UpgradeStudents from "./UpgradeStudents";

class Strudents extends Component {
  static contextType = PeriodContext;

  state = {
    list: [
      "Add students",
      "My students",
      "Promote students",
      "Lay off students",
    ],
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect
          to={`/school/${this.context.siteName}/students/addstudents`}
        />
      );
    else
      return (
        <Redirect to={`/school/${this.context.siteName}/students/${type}`} />
      );
  };

  render() {
    let { siteName } = this.context;
    let type = this.props.match.params.type;

    return (
      <React.Fragment>
        <CrudList
          list={this.state.list}
          baseURL={`/school/${siteName}/students`}
          type={type}
        />
        <Switch>
          <Route
            path="/school/:name/students/addstudents/:type?"
            component={AddStudents}
          />
          <Route
            path="/school/:name/students/mystudents"
            component={GetStudents}
          />
          <Route
            path="/school/:name/students/layoffstudents"
            component={LayOffStudent}
          />
          <Route
            path="/school/:name/students/Promotestudents"
            component={UpgradeStudents}
          />
          {this.redirectTo()}
        </Switch>
      </React.Fragment>
    );
  }
}

export default Strudents;
