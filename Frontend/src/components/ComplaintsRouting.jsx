import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Complaints from "./School/Announcements/Complaints";
import SpecificAnnouncement from "./SpecificAnnouncement";

class ComplaintsRouting extends Component {
  state = {};
  render() {
    return (
      <Switch>
        <Route
          path="/school/:name/complaints/view"
          component={SpecificAnnouncement}
        />
        <Route path="/school/:name/complaints" component={Complaints} />
      </Switch>
    );
  }
}

export default ComplaintsRouting;
