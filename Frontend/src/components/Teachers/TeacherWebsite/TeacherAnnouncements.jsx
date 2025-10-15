import React, { Component } from "react";
import CrudList from "../../CrudList";
import PeriodContext from "../../../contexts/periodContext";
import { Switch } from "react-router";
import { Redirect, Route } from "react-router-dom";
import SetTeacherAnnouncements from "./SetTeacherAnnouncements";
import AnnouncementsRouting from "./AnnouncementsRouting";

class TeacherAnnouncements extends Component {
  static contextType = PeriodContext;

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect
          to={`/school/${this.context.siteName}/Announcements/ViewAnnouncements`}
        />
      );
    else
      return (
        <Redirect
          to={`/school/${this.context.siteName}/Announcements/${type}`}
        />
      );
  };

  state = {};
  render() {
    let id = this.props.match.params.id;
    let type = this.props.match.params.type;

    return (
      <React.Fragment>
        <CrudList
          list={["Set Announcements", "View Announcements"]}
          baseURL={`/teacher/${this.context.account.teacherId}/Announcements`}
          type={type}
        />
        <Switch>
          <Route
            path={`/teacher/:id/Announcements/ViewAnnouncements`}
            component={AnnouncementsRouting}
          />
          <Route
            path={`/teacher/:id/Announcements/SetAnnouncements`}
            component={SetTeacherAnnouncements}
          />
          <Redirect to={`/teacher/${id}/Announcements/SetAnnouncements`} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default TeacherAnnouncements;
