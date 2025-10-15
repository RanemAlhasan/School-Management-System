import React from "react";
import Form from "../../Form";
import Selection from "../../Selection";
import PeriodContext from "../../../contexts/periodContext";
import { getStudentYears } from "../../../services/studentService";

class SchoolPeriod extends Form {
  static contextType = PeriodContext;

  state = {
    data: [],
    heading: "",
  };

  componentDidMount = async () => {
    // Requests
    let type = this.props.parent ? "parent" : "student";
    let data = await getStudentYears(this.context.account, type);

    // Session storage check
    if (sessionStorage.getItem("selectedYear")) {
      let [startYear, endYear, schoolName] = sessionStorage
        .getItem("selectedYear")
        .split(" - ");
      let studentId = this.context.account.studentId;
      let parentId = this.context.account.parentId;
      let siteName = sessionStorage.getItem("siteName");
      let id = sessionStorage.getItem("id");
      let account = {
        startYear,
        endYear,
        schoolName,
        parentId,
        studentId,
        siteName,
        id,
      };
      this.context.change(account, true);
    }

    // Data check
    else {
      let account = {
        startYear: data[0].startYear,
        endYear: data[0].endYear,
        parentId: this.context.account.parentId,
        studentId: this.context.account.studentId,
        siteName: data[0].siteName,
        id: data[0].id,
        schoolName: data[0].school,
      };
      this.context.change(account, true);
    }

    // Mapping and updating the state
    data = data.map(
      (element) =>
        `${element.startYear} - ${element.endYear} - ${element.school}`
    );
    this.setState({ data });
  };

  handleSelect = async (element) => {
    let [startYear, endYear, schoolName] = element.split(" - ");
    let studentId = this.context.account.studentId;
    let parentId = this.context.account.parentId;
    let type = this.props.parent ? "parent" : "student";

    let data = await getStudentYears(this.context.account, type);
    let siteName = data.find(
      (element) =>
        element.startYear === parseInt(startYear) &&
        element.endYear === parseInt(endYear) &&
        element.school === schoolName
    );

    let account = {
      startYear,
      endYear,
      studentId,
      parentId,
      siteName: siteName.siteName,
      schoolName,
      id: siteName.id,
    };
    sessionStorage.setItem("selectedYear", element);
    sessionStorage.setItem("siteName", account.siteName);
    sessionStorage.setItem("id", account.id);
    this.context.change(account);
  };

  render() {
    let { startYear, endYear, schoolName } = this.context.account;
    let heading = `${startYear} - ${endYear} - ${schoolName}`;

    return (
      <div id="year">
        <h4>Study period</h4>
        <div id="years">
          <Selection
            heading={heading}
            handleSelect={this.handleSelect}
            data={this.state.data}
          />
        </div>
      </div>
    );
  }
}

export default SchoolPeriod;
