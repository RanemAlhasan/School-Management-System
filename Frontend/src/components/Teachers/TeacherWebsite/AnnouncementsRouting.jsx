import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import SpecificAnnouncement from "../../SpecificAnnouncement";
import ViewTeacherAnnouncements from "./ViewTeacherAnnouncements";

class AnnouncementsRouting extends Component {
  state = {};
  render() {
    return (
      <Switch>
        <Route
          path="/teacher/:id/announcements/ViewAnnouncements/specific"
          component={SpecificAnnouncement}
        />
        <Route
          path="/teacher/:id/announcements/ViewAnnouncements"
          component={ViewTeacherAnnouncements}
        />
      </Switch>
    );
  }
}

export default AnnouncementsRouting;
