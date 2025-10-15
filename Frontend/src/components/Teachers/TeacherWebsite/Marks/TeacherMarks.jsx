import React, { Component } from "react";
import CrudList from "../../../CrudList";
import PeriodContext from "../../../../contexts/periodContext";
import { Redirect, Route, Switch } from "react-router-dom";
import SetMarks from "./SetMarks";
import ViewMarks from "./ViewMarks";

class TeacherMarks extends Component {
  static contextType = PeriodContext;

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect to={`/school/${this.context.siteName}/marks/SetMarks`} />
      );
    else
      return <Redirect to={`/school/${this.context.siteName}/marks/${type}`} />;
  };

  render() {
    let id = this.props.match.params.id;
    let type = this.props.match.params.type;
    return (
      <React.Fragment>
        <CrudList
          list={["Set marks", "View marks"]}
          baseURL={`/teacher/${id}/marks`}
          type={type}
        />
        <Switch>
          <Route path="/teacher/:id/marks/SetMarks" component={SetMarks} />
          <Route path="/teacher/:id/marks/ViewMarks" component={ViewMarks} />
          <Redirect to={`/teacher/${id}/marks/SetMarks`} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default TeacherMarks;
