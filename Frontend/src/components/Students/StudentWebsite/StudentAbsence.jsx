import React, { Component } from "react";
import { getDefaultValues } from "../../../services/defaultContextValues";
import PeriodContext from "../../../contexts/periodContext";
import {
  getAbsences,
  decodeAbsences,
  getInformationProfile,
  getNameFromProfile,
} from "../../../services/studentService";
import AbsenceTable from "../../School/AbsenceTable";

class StudentAbsence extends Component {
  static contextType = PeriodContext;
  state = {
    absences: [],
    name: "",
  };
  componentDidMount = async () => {
    let type = this.props.parent ? "parent" : "student";
    let account = await getDefaultValues(this.context.account, type);
    let { studentId } = account;
    try {
      let { data } = await getInformationProfile(studentId);
      let name = getNameFromProfile(data);
      try {
        let { data } = await getAbsences(account, type);
        let absences = decodeAbsences(data);
        console.log(absences);
        this.setState({
          absences,
          name,
        });
      } catch (error) {}
    } catch (error) {}
  };

  render() {
    let absences = this.state.absences;
    let name = this.state.name;
    let props = { absences: absences, name: name };
    return <AbsenceTable {...props} />;
  }
}

export default StudentAbsence;
