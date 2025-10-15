import React, { Component } from "react";
import { getTeacherDefaultValues } from "../../../services/defaultContextValues";
import PeriodContext from "../../../contexts/periodContext";
import {
  getAbsences,
  decodeAbsences,
  getNameFromProfile,
  getInformationProfile,
} from "../../../services/teacherService";
import AbsenceTable from "../../School/AbsenceTable";

class TeacherAbsence extends Component {
  static contextType = PeriodContext;
  state = {
    absences: [],
    name: "",
  };
  componentDidMount = async () => {
    let { account } = this.context;
    account = await getTeacherDefaultValues(account);
    console.log(account);
    let { teacherId } = account;
    try {
      let { data } = await getInformationProfile(teacherId);
      let name = getNameFromProfile(data);
      try {
        let { data } = await getAbsences(account);
        let absences = decodeAbsences(data);
        this.setState({
          absences,
          name,
        });
        console.log(this.state.name);
      } catch (error) {
        console.error();
      }
    } catch (error) {
      console.error();
    }
  };

  render() {
    let absences = this.state.absences;
    let name = this.state.name;
    let props = { absences: absences, name: name };

    return <AbsenceTable {...props} />;
  }
}

export default TeacherAbsence;
