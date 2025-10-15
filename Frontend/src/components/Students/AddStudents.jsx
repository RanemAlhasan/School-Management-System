import React, { Component } from "react";
import CrudList from "../CrudList";
import { Redirect, Route, Switch } from "react-router";
import NewStudent from "./NewStudent";
import ExitstingStudents from "./ExistingStudent";
import PeriodContext from "../../contexts/periodContext";

class AddStudents extends Component {
  static contextType = PeriodContext;

  state = {
    list: ["New student", "Existing student"],
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    console.log(type);
    if (!type)
      return (
        <Redirect
          to={`/school/${this.context.siteName}/students/Addstudents/newstudent`}
        />
      );
    else
      return (
        <Redirect
          to={`/school/${this.context.siteName}/students/Addstudents/${type}`}
        />
      );
  };

  componentDidMount = () => {
    console.log(this.props.match.params);
  };

  render() {
    let { siteName } = this.context;
    let type = this.props.match.params.type;

    return (
      <div id="addition">
        <h4>Choose addition method</h4>
        <CrudList
          list={this.state.list}
          baseURL={`/school/${siteName}/students/Addstudents`}
          type={type}
        />
        <Switch>
          <Route
            path="/school/:name/students/Addstudents/newstudent"
            component={NewStudent}
          />
          <Route
            path="/school/:name/students/Addstudents/existingstudent"
            component={ExitstingStudents}
          />
          <Redirect
            to={`/school/${siteName}/students/Addstudents/newstudent`}
          />
        </Switch>
      </div>
    );
  }
}

export default AddStudents;
