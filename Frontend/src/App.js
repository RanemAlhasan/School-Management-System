import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router";
import Login from "./components/Login";
import Signup from "./components/Sign up/Signup";
import School from "./components/School";
import Student from "./components/Students/StudentWebsite/Student";
import NotFound from "./components/NotFound";
import Teacher from "./components/Teachers/TeacherWebsite/Teacher";
import Parent from "./components/Parent Website/Parent";
import PublicSchoolContent from "./components/PublicSchoolContent";
import "react-toastify/dist/ReactToastify.css";
import "line-awesome/dist/line-awesome/css/line-awesome.css";
import Home from "./components/Website Home Page/Home";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/school/:name/contents" component={PublicSchoolContent} />
        <Route path="/school/:name/:type?" component={School} />
        <Route path="/student/:id/:type?" component={Student} />
        <Route path="/teacher/:id/:type?" component={Teacher} />
        <Route path="/parent/:id/:stdId/:type?" component={Parent} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/notfound" component={NotFound} />
        <Route path="/" exact component={Home} />
        <Redirect to="/notfound" />
      </Switch>
    );
  }
}

export default App;
