import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router";
import CrudList from "../CrudList";
import SetMarks from "./SetMarks";
import ViewMarks from "./ViewMarks";
import PeriodContext from "../../contexts/periodContext";
import SetExamMarks from "./SetExamMarks";

class Marks extends Component {
  static contextType = PeriodContext;

  state = {
    list: ["Set marks", "Set exam marks", "View marks"],
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect to={`/school/${this.context.siteName}/marks/setmarks`} />
      );
    else
      return <Redirect to={`/school/${this.context.siteName}/marks/${type}`} />;
  };

  render() {
    let { siteName } = this.context;
    let type = this.props.match.params.type;

    return (
      <div id="marks">
        <CrudList
          list={this.state.list}
          baseURL={`/school/${siteName}/marks`}
          type={type}
        />
        <Switch>
          <Route
            path={`/school/${siteName}/marks/setmarks`}
            component={SetMarks}
          />
          <Route
            path={`/school/${siteName}/marks/setexammarks`}
            component={SetExamMarks}
          />
          <Route
            path={`/school/${siteName}/marks/viewmarks`}
            component={ViewMarks}
          />
          <Redirect to={`/school/${siteName}/marks/setmarks`} />
        </Switch>
      </div>
    );
  }
}

export default Marks;
