import React, { Component } from "react";
import PeriodContext from "../contexts/periodContext";
import { Route, Switch, Redirect } from "react-router-dom";
import AddSubject from "./Subject/AddSubject";
import CrudList from "./CrudList";
import getSubjects from "./Subject/getSubject";
import DeleteSubject from "./Subject/DeleteSubject";

class Subject extends Component {
  static contextType = PeriodContext;

  state = {
    list: ["Add Subjects", "My Subjects","Delete Subject"],
    selected: 0,
  };

  handleClick = (index) => {
    this.setState({ selected: index });
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect to={`/school/${this.context.siteName}/subject/addsubjects`} />
      );
    else
      return (
        <Redirect to={`/school/${this.context.siteName}/subject/${type}`} />
      );
  };

  render() {
    let { siteName } = this.context;
    let type = this.props.match.params.type;

    return (
      <div id="classroom">
        <CrudList
          list={this.state.list}
          baseURL={`/school/${siteName}/subject`}
          type={type}
        />
        <Switch>
          <Route
            path={`/school/${siteName}/subject/addsubjects`}
            component={AddSubject}
          />
          <Route
            path={`/school/${siteName}/subject/Mysubjects`}
            component={getSubjects}
          />
          <Route
            path={`/school/${siteName}/subject/deletesubject`}
            component={DeleteSubject}
          />
          {this.redirectTo()}
        </Switch>
      </div>
    );
  }
}

export default Subject;
