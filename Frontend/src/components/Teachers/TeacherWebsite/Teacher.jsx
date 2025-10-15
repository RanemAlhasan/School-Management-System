import React, { Component } from "react";
import SideList from "../../SideList";
import { Switch, Route } from "react-router";
import PeriodContext from "../../../contexts/periodContext";
import TeacherDashboard from "./TeacherDashboard";
import TeacherSchedule from "./TeacherSchedule";
import TeacherAnnouncements from "./TeacherAnnouncements";
import { Redirect } from "react-router-dom";
import { getJwt } from "../../../services/loginService";
import { getTeacherName } from "../../../services/teacherService";
import TeacherAbsence from "./TeacherAbsence";
import TeacherProfile from "./TeacherProfile";
import TeacherMarks from "./Marks/TeacherMarks";
import TeacherHomeworks from "./TeacherHomeworks";
import ScientificContent from "./ScientificContent";

class Teacher extends Component {
  static contextType = PeriodContext;

  state = {
    account: {
      startYear: "",
      endYear: "",
      teacherId: this.props.match.params.id,
      siteName: "",
      schoolId: "",
    },
  };

  handleChange = (account) => {
    this.setState({ account });
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    let id = this.props.match.params.id;
    if (!type) return <Redirect to={`/teacher/${id}/Profile`} />;
    return <Redirect to={`/teacher/${id}/${type}`} />;
  };

  authorization = () => {
    let id = this.props.match.params.id;
    if (!localStorage.getItem(`token-teacher-${id}`))
      return <Redirect to="/login" />;
  };

  logout = () => {
    localStorage.removeItem(`token-teacher-${this.state.account.teacherId}`);
    window.location = "/login";
  };

  teacherName = () => {
    let id = this.props.match.params.id;
    let jwt = getJwt(`teacher-${id}`);
    return getTeacherName(jwt);
  };

  render() {
    let id = this.props.match.params.id;
    let auth = localStorage.getItem(`token-teacher-${id}`);
    let teacherName = this.teacherName();

    return (
      <PeriodContext.Provider
        value={{ change: this.handleChange, account: this.state.account }}
      >
        {this.authorization()}
        <div id="school-container">
          <SideList />
          <div id="school-dashboard">
            {auth && (
              <TeacherDashboard
                type={this.props.match.params.type}
                teacherName={teacherName}
              />
            )}
          </div>
          <div id="school-content">
            <h3>
              <i className="las la-home" />
              {teacherName}
              <button className="small-logout" onClick={this.logout}>
                Log out
              </button>
            </h3>
            <button className="logout" onClick={this.logout}>
              Log out
            </button>
            <div id="content">
              <Switch>
                <Route
                  path={`/teacher/:id/marks/:type?`}
                  component={TeacherMarks}
                />
                <Route
                  path={`/teacher/:id/WeeklySchedule`}
                  component={TeacherSchedule}
                />
                <Route
                  path={`/teacher/:id/Announcements/:type?`}
                  component={TeacherAnnouncements}
                />
                <Route
                  path={`/teacher/:id/Absence`}
                  component={TeacherAbsence}
                />
                <Route
                  path={`/teacher/:id/Profile`}
                  component={TeacherProfile}
                />
                <Route
                  path={`/teacher/:id/Homeworks`}
                  component={TeacherHomeworks}
                />
                <Route
                  path={`/teacher/:id/ScientificContent`}
                  component={ScientificContent}
                />
                {this.redirectTo()}
              </Switch>
            </div>
          </div>
        </div>
      </PeriodContext.Provider>
    );
  }
}

export default Teacher;
