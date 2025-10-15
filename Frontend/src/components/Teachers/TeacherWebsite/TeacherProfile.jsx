import React, { Component } from "react";
import { getTeacherDefaultValues } from "../../../services/defaultContextValues";
import PeriodContext from "../../../contexts/periodContext";
import {
  getInformationProfile,
  decodeInformationProfile,
} from "../../../services/teacherService";
import { Profile } from "./Profile";

class TeacherProfile extends Component {
  static contextType = PeriodContext;

  state = {
    teacher: {},
  };

  componentDidMount = async () => {
    let { account } = this.context;
    account = await getTeacherDefaultValues(account);
    let { teacherId } = account;
    try {
      let { data } = await getInformationProfile(teacherId);
      console.log(data);
      let teacher = decodeInformationProfile(data);
      console.log(data);
      this.setState({
        teacher,
      });
      console.log("teacher");
      console.log(this.state.teacher);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let teacher = this.state.teacher;
    let props = { teacher: teacher };
    return <Profile {...props} />;
  }
}

export default TeacherProfile;
