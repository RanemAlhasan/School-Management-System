import { Component } from "react";
import { getDefaultValues } from "../../../services/defaultContextValues";
import PeriodContext from "../../../contexts/periodContext";
import {
  getInformationProfile,
  decodeInformationProfile,
} from "../../../services/studentService";
import { Profile } from "./Profile";

class StudentProfile extends Component {
  static contextType = PeriodContext;

  state = {
    student: {},
  };

  componentDidMount = async () => {
    let account = await getDefaultValues(this.context.account);
    console.log(account);
    let { studentId } = account;
    try {
      let { data } = await getInformationProfile(studentId);
      let student = decodeInformationProfile(data);
      console.log(data);
      this.setState({
        student,
      });
      console.log("student");
      console.log(this.state.student);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let student = this.state.student;
    let props = { student: student };
    return <Profile {...props} />;
  }
}

export default StudentProfile;
