import React, { Component } from "react";
import StudentDashboard from "./StudentDashboard";
import SideList from "../../SideList";
import { Switch, Route } from "react-router";
import PeriodContext from "../../../contexts/periodContext";
import StudentMarks from "./StudentMarks";
import StudentSchedule from "./StudentSchedule";
import Complaints from "./Complaints";
import AnnouncementsRouting from "./AnnouncementsRouting";
import showStudentTeachers from "./ShowStudentTeachers";
import StudentFees from "./StudentFees";
import StudentAbsence from "./StudentAbsence";
import StudentProfile from "./StudentProfile";
import { Redirect } from "react-router-dom";
import { getJwt } from "../../../services/loginService";
import { getStudentName } from "../../../services/studentService";
import StudentExamSchedules from "./StudentExamSchedules";
import StudentHomeworks from "./StudentHomeworks";
import ScientificContent from "./ScientifiContent";

class School extends Component {
  static contextType = PeriodContext;

  state = {
    account: {
      startYear: "",
      endYear: "",
      studentId: this.props.match.params.id,
      siteName: "",
      id: "",
      schoolName: "",
    },

    authorized: false,
  };

  handleChange = (account, start) => {
    this.setState({ account });
    if (!start) window.location = window.location.href;
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    let id = this.props.match.params.id;
    if (!type) return <Redirect to={`/student/${id}/Profile`} />;
    return <Redirect to={`/student/${id}/${type}`} />;
  };

  authorized = () => {
    let id = this.props.match.params.id;
    if (!localStorage.getItem(`token-student-${id}`))
      return <Redirect to="/login" />;
  };

  logout = () => {
    localStorage.removeItem(`token-student-${this.state.account.studentId}`);
    window.location = "/login";
  };

  studentName = () => {
    let jwt = getJwt(`student-${this.props.match.params.id}`);
    let studentName = getStudentName(jwt);
    return studentName;
  };

  render() {
    let id = this.props.match.params.id;
    let authorized = localStorage.getItem(`token-student-${id}`);
    let studentName = this.studentName();

    return (
      <PeriodContext.Provider
        value={{ change: this.handleChange, account: this.state.account }}
      >
        {this.authorized()}
        <div id="school-container">
          <SideList />
          <div id="school-dashboard">
            {authorized && (
              <StudentDashboard
                type={this.props.match.params.type}
                studentName={studentName}
              />
            )}
          </div>
          <div id="school-content">
            <h3>
              <i className="las la-home" />
              {studentName}
              <button className="small-logout" onClick={this.logout}>
                Log out
              </button>
            </h3>
            <button className="logout" onClick={this.logout}>
              Log out
            </button>
            <div id="content">
              <Switch>
                <Route path={`/student/:id/marks`} component={StudentMarks} />
                <Route
                  path={`/student/:id/WeeklySchedule`}
                  component={StudentSchedule}
                />
                <Route
                  path={`/student/:id/Complaints`}
                  component={Complaints}
                />
                <Route
                  path={`/student/:id/Announcements`}
                  component={AnnouncementsRouting}
                />
                <Route
                  path={`/student/:id/MyTeachers`}
                  component={showStudentTeachers}
                />
                <Route
                  path={`/student/:id/Absence`}
                  component={StudentAbsence}
                />
                <Route
                  path={`/student/:id/Profile`}
                  component={StudentProfile}
                />
                <Route
                  path={`/student/:id/ExamSchedules`}
                  component={StudentExamSchedules}
                />
                <Route
                  path={`/student/:id/Homeworks`}
                  component={StudentHomeworks}
                />
                <Route
                  path={`/student/:id/ScientificContent`}
                  component={ScientificContent}
                />
                <Route path={`/student/:id/Fees`} component={StudentFees} />
                {this.redirectTo()}
              </Switch>
            </div>
          </div>
        </div>
      </PeriodContext.Provider>
    );
  }
}

export default School;
