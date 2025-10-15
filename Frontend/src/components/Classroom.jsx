import React, { Component } from "react";
import PeriodContext from "../contexts/periodContext";
import { Redirect, Route, Switch } from "react-router-dom";
import AddClassrooms from "./Classroom/AddClassrooms";
import CrudList from "./CrudList";
import GetClassrooms from "./Classroom/GetClassrooms";
import DeleteClassrooms from "./Classroom/DeleteClassrooms";

class Classroom extends Component {
  static contextType = PeriodContext;

  state = {
    list: ["Add classrooms", "My classrooms", "Delete classrooms"],
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect
          to={`/school/${this.context.siteName}/classroom/addclassrooms`}
        />
      );
    else
      return (
        <Redirect to={`/school/${this.context.siteName}/classroom/${type}`} />
      );
  };

  render() {
    let { siteName } = this.context;
    let type = this.props.match.params.type;

    return (
      <div id="classroom">
        <CrudList
          list={this.state.list}
          baseURL={`/school/${siteName}/classroom`}
          type={type}
        />
        <Switch>
          <Route
            path="/school/:name/classroom/addclassrooms"
            component={AddClassrooms}
          />
          <Route
            path="/school/:name/classroom/myclassrooms"
            component={GetClassrooms}
          />
          <Route
            path="/school/:name/classroom/Deleteclassrooms"
            component={DeleteClassrooms}
          />
          {this.redirectTo()}
        </Switch>
      </div>
    );
  }
}

export default Classroom;
