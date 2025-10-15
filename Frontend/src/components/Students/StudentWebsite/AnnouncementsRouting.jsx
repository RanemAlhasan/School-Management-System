import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import SpecificAnnouncement from "../../SpecificAnnouncement";
import StudentAnnouncements from "./StudentAnnouncements";

class AnnouncementsRouting extends Component {
  state = {};
  render() {
    return (
      <Switch>
        <Route
          path="/student/:id/announcements/view"
          component={SpecificAnnouncement}
        />
        <Route
          path="/parent/:id/:stdId/announcements/view"
          component={SpecificAnnouncement}
        />
        <Route
          path="/student/:id/announcements"
          component={StudentAnnouncements}
        />
        <Route
          path="/parent/:id/:stdId/announcements"
          render={(props) => <StudentAnnouncements parent={true} {...props} />}
        />
      </Switch>
    );
  }
}

export default AnnouncementsRouting;
