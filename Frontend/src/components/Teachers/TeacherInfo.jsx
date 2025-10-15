import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import TeacherClass from "./TeacherClass";
import TeacherTimes from "./TeacherTimes";
import PeriodContext from "../../contexts/periodContext";
import { getClassesAnnouncements } from "../../services/announcementsService";

class TeacherInfo extends Component {
  static contextType = PeriodContext;

  state = {
    list: ["Teacher classes", "Teacher available times"],
  };

  async componentDidMount() {
    console.log(
      await getClassesAnnouncements(this.context.account, this.context.siteName)
    );
  }

  render() {
    let { siteName } = this.context;

    return (
      <React.Fragment>
        <Switch>
          <Route
            path={`/school/${siteName}/teacher'sinfo/teacherclasses`}
            component={TeacherClass}
          />
          <Route
            path={`/school/${siteName}/teacher'sinfo/teacheravailabletimes`}
            component={TeacherTimes}
          />
          <Redirect to={`/school/${siteName}/teacher'sinfo/teacherclasses`} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default TeacherInfo;
