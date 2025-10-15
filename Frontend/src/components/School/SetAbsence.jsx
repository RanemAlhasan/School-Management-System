import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import CrudList from "../CrudList";
import PeriodContext from "../../contexts/periodContext";
import Absence from "./Absence";
import ViewAbsence from "../Absence/ViewAbsence";

class SetAbsence extends Component {
  static contextType = PeriodContext;

  state = {};

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect to={`/school/${this.context.siteName}/absence/setAbsence`} />
      );
    else
      return (
        <Redirect to={`/school/${this.context.siteName}/absence/${type}`} />
      );
  };

  render() {
    let { siteName } = this.context;
    let type = this.props.match.params.type;
    console.log(type);

    return (
      <div id="absence">
        <CrudList
          baseURL={`/school/${siteName}/absence`}
          list={["Set absence", "View absence"]}
          type={type}
        />
        <Switch>
          <Route
            path={`/school/${siteName}/absence/setAbsence/:type?`}
            component={Absence}
          />
          <Route
            path={`/school/${siteName}/absence/ViewAbsence/:type?`}
            component={ViewAbsence}
          />
          {this.redirectTo()}
        </Switch>
      </div>
    );
  }
}

export default SetAbsence;
