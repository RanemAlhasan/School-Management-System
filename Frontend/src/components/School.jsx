import React, { Component } from "react";
import Dashboard from "./Dashboard";
import SideList from "./SideList";
import { Switch, Route, Redirect } from "react-router";
import Classes from "./Classes";
import Classroom from "./Classroom";
import PeriodContext from "../contexts/periodContext";
import Subject from "./Subject";
import Students from "./Students/Students";
import Teachers from "./Teachers/Teachers";
import Marks from "./Marks/Marks";
import SortStudents from "./Students/SortStudents";
import SchoolInfo from "./SchoolInfo";
import TeacherInfo from "./Teachers/TeacherInfo";
import Announcements from "./School/Announcements/Announcements";
import ExamSchedule from "./School/Exam Schedule/ExamSchedule";
import WeeklySchedule from "./School/Schedule/WeeklySchedule";
import MarksReport from "./Marks/MarksReport";
import ComplaintsRouting from "./ComplaintsRouting";
import Fees from "./School/Fees/Fees";
import SchoolContent from "./School/Public Content/SchoolContent";
import SetAbsence from "./School/SetAbsence";
import test from "./test";
import Homeworks from "./School/Announcements/Homeworks";
import ScientificContent from "./School/Announcements/ScientificContent";

class School extends Component {
  static contextType = PeriodContext;

  state = {
    account: {
      startYear: sessionStorage.getItem("selectedYear")
        ? parseInt(sessionStorage.getItem("selectedYear").split(" - ")[0])
        : new Date().getFullYear() - 1,

      endYear: sessionStorage.getItem("selectedYear")
        ? parseInt(sessionStorage.getItem("selectedYear").split(" - ")[1])
        : new Date().getFullYear(),
    },
    siteName: this.props.match.params.name,
  };

  handleChange = (account) => {
    this.setState({ account });
    window.location = window.location.href;
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    let { siteName } = this.state;
    if (!type) return <Redirect to={`/school/${siteName}/schoolInfo`} />;
    return <Redirect to={`/school/${siteName}/${type}`} />;
  };

  authorized = () => {
    let name = this.props.match.params.name;
    if (!localStorage.getItem(`token-${name}`)) return <Redirect to="/login" />;
  };

  logout = () => {
    localStorage.removeItem(`token-${this.state.siteName}`);
    window.location = "/login";
  };

  render() {
    let { siteName } = this.state;
    return (
      <PeriodContext.Provider
        value={{
          change: this.handleChange,
          account: this.state.account,
          siteName: this.state.siteName,
        }}
      >
        <div id="school-container">
          <SideList />
          <div id="school-dashboard">
            <Dashboard type={this.props.match.params.type} />
          </div>
          <div id="school-content">
            <h3>
              <i className="las la-home" />
              {siteName}
              <button className="small-logout" onClick={this.logout}>
                Log out
              </button>
            </h3>
            <button className="logout" onClick={this.logout}>
              Log out
            </button>
            <div id="content">
              <Switch>
                {this.authorized()}
                <Route path="/school/:name/schoolinfo" component={SchoolInfo} />
                <Route
                  path="/school/:name/classes/:type?"
                  component={Classes}
                />
                <Route
                  path="/school/:name/classroom/:type?"
                  component={Classroom}
                />
                <Route
                  path="/school/:name/subject/:type?"
                  component={Subject}
                />
                <Route
                  path="/school/:name/students/:type?/:secondType?"
                  component={Students}
                />
                <Route
                  path="/school/:name/teachers/:type?"
                  component={Teachers}
                />
                <Route
                  path="/school/:name/teacher'sinfo"
                  component={TeacherInfo}
                />
                <Route path="/school/:name/marks/:type?" component={Marks} />
                <Route
                  path="/school/:name/sortStudents/:type?"
                  component={SortStudents}
                />
                <Route
                  path="/school/:name/schoolcontent/:type?"
                  component={SchoolContent}
                />
                <Route
                  path="/school/:name/announcements/:type?"
                  component={Announcements}
                />
                <Route
                  path="/school/:name/absence/:type?"
                  component={SetAbsence}
                />
                <Route
                  path="/school/:name/ExamSchedule/:type?"
                  component={ExamSchedule}
                />
                <Route
                  path="/school/:name/WeeklySchedule/:type?"
                  component={WeeklySchedule}
                />
                <Route
                  path="/school/:name/MarksReport"
                  component={MarksReport}
                />
                <Route
                  path="/school/:name/Complaints"
                  component={ComplaintsRouting}
                />
                <Route path="/school/:name/Fees/:type?" component={Fees} />
                <Route path="/school/:name/Test" component={test} />
                <Route
                  path="/school/:name/Homeworks/:type?"
                  component={Homeworks}
                />
                <Route
                  path="/school/:name/ScientificContent/:type?"
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

export default School;
