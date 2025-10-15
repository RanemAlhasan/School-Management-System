import React, { Component } from "react";
import SideList from "../SideList";
import { Switch } from "react-router";
import ParentDashboard from "./ParentDashboard";
import PeriodContext from "../../contexts/periodContext";
import StudentSchedule from "../Students/StudentWebsite/StudentSchedule";
import { Redirect, Route } from "react-router-dom";
import StudentMarks from "../Students/StudentWebsite/StudentMarks";
import AnnouncementsRouting from "../Students/StudentWebsite/AnnouncementsRouting";
import ShowStudentsTeachers from "../Students/StudentWebsite/ShowStudentTeachers";
import StudentFees from "../Students/StudentWebsite/StudentFees";
import StudentAbsence from "../Students/StudentWebsite/StudentAbsence";
import StudentExamSchedules from "../Students/StudentWebsite/StudentExamSchedules";
import { decodeJwt, getJwt } from "../../services/loginService";
import StudentHomeworks from "../Students/StudentWebsite/StudentHomeworks";
import ScientificContent from "../Students/StudentWebsite/ScientifiContent";

class Parent extends Component {
  static contextType = PeriodContext;

  state = {
    account: {
      startYear: "",
      endYear: "",
      parentId: this.props.match.params.id,
      studentId: this.props.match.params.stdId,
      siteName: "",
      id: "",
      schoolName: "",
    },
  };

  handleChange = (account, start) => {
    this.setState({ account });
    if (!start) window.location = window.location.href;
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    let { id, stdId } = this.props.match.params;

    if (!type) return <Redirect to={`/parent/${id}/${stdId}/Marks`} />;
    return <Redirect to={`/parent/${id}/${stdId}/${type}`} />;
  };

  logout = () => {
    localStorage.removeItem(`token-parent-${this.state.account.parentId}`);
    window.location = "/login";
  };

  authorization = () => {
    let id = this.props.match.params.id;
    if (!localStorage.getItem(`token-parent-${id}`))
      return <Redirect to="/login" />;
  };

  getStudentName = () => {
    try {
      let data = decodeJwt(getJwt(`parent-${this.state.account.parentId}`));
      return data.studentFullName;
    } catch (error) {
      return "";
    }
  };

  render() {
    let { parentId, studentId } = this.state.account;
    let id = this.props.match.params.id;
    let auth = localStorage.getItem(`token-parent-${id}`);
    let studentName = this.getStudentName();

    return (
      <PeriodContext.Provider
        value={{ change: this.handleChange, account: this.state.account }}
      >
        {this.authorization()}
        <div id="school-container">
          <SideList />
          <div id="school-dashboard">
            {auth && (
              <ParentDashboard
                type={this.props.match.params.type}
                studentName={studentName}
              />
            )}
          </div>
          <div id="school-content">
            <h3>
              <i className="las las-home" />
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
                <Route
                  path={`/parent/${parentId}/${studentId}/WeeklySchedule`}
                  render={(props) => (
                    <StudentSchedule parent={true} {...props} />
                  )}
                />
                <Route
                  path={`/parent/${parentId}/${studentId}/Marks`}
                  render={(props) => <StudentMarks parent={true} {...props} />}
                />
                <Route
                  path={`/parent/${parentId}/${studentId}/Announcements`}
                  render={(props) => (
                    <AnnouncementsRouting parent={true} {...props} />
                  )}
                />
                <Route
                  path={`/parent/${parentId}/${studentId}/Teachers`}
                  render={(props) => (
                    <ShowStudentsTeachers parent={true} {...props} />
                  )}
                />
                <Route
                  path={`/parent/${parentId}/${studentId}/Fees`}
                  render={(props) => <StudentFees parent={true} {...props} />}
                />
                <Route
                  path={`/parent/${parentId}/${studentId}/Absence`}
                  render={(props) => (
                    <StudentAbsence parent={true} {...props} />
                  )}
                />
                <Route
                  path={`/parent/${parentId}/${studentId}/ExamSchedules`}
                  render={(props) => (
                    <StudentExamSchedules parent={true} {...props} />
                  )}
                />
                <Route
                  path={`/parent/${parentId}/${studentId}/Homeworks`}
                  render={(props) => (
                    <StudentHomeworks parent={true} {...props} />
                  )}
                />
                <Route
                  path={`/parent/${parentId}/${studentId}/ScientificContent`}
                  render={(props) => (
                    <ScientificContent parent={true} {...props} />
                  )}
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

export default Parent;
