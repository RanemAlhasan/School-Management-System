import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router";
import CrudList from "../CrudList";
import AddTeachers from "./AddTeachers";
import PeriodContext from "../../contexts/periodContext";
import GetTeachers from "./Getteachers";

class Strudents extends Component {
  static contextType = PeriodContext;

  state = {
    list: ["Add teachers", "My teachers"],
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect
          to={`/school/${this.context.siteName}/teachers/addteachers`}
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
      <React.Fragment>
        <CrudList
          list={this.state.list}
          baseURL={`/school/${siteName}/teachers`}
          type={type}
        />
        <Switch>
          <Route
            path="/school/:name/teachers/addteachers/:type?"
            component={AddTeachers}
          />
          <Route
            path="/school/:name/teachers/myteachers"
            component={GetTeachers}
          />

          <Redirect to={`/school/${siteName}/teachers/addteachers`} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default Strudents;
