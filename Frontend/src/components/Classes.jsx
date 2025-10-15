import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router";
import AddClasses from "./Classes/AddClasses";
import GetClasses from "./Classes/GetClasses";
import CrudList from "./CrudList";
import PeriodContext from "../contexts/periodContext";
import DeleteClasses from "./Classes/DeleteClasses";

class Classes extends Component {
  static contextType = PeriodContext;

  state = {
    list: ["Add classes", "My classes", "Delete classes"],
  };

  componentDidMount = () => {
    let type = this.props.match.params.type;
    console.log(type);
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect to={`/school/${this.context.siteName}/classes/addclasses`} />
      );
    else
      return (
        <Redirect to={`/school/${this.context.siteName}/classes/${type}`} />
      );
  };

  render() {
    let type = this.props.match.params.type;

    return (
      <React.Fragment>
        <CrudList
          list={this.state.list}
          baseURL={`/school/${this.context.siteName}/classes`}
          type={type}
        />
        <Switch>
          <Route
            path="/school/:name/classes/addclasses"
            component={AddClasses}
          />
          <Route
            path="/school/:name/classes/myclasses"
            component={GetClasses}
          />
          <Route
            path="/school/:name/classes/Deleteclasses"
            component={DeleteClasses}
          />
          {this.redirectTo()}
        </Switch>
      </React.Fragment>
    );
  }
}

export default Classes;
