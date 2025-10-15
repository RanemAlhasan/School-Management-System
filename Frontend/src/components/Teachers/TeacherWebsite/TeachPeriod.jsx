import React from "react";
import Form from "../../Form";
import Selection from "../../Selection";
import PeriodContext from "../../../contexts/periodContext";
import { getTeacherSchools } from "../../../services/teacherService";

class TeachPeriod extends Form {
  static contextType = PeriodContext;

  state = {
    data: [],
    schoolsNames: [],

    selectedYear: "",
    siteName: "",
    schoolId: "",
  };

  componentDidMount = async () => {
    let { account } = this.context;

    let data = await getTeacherSchools(account);
    let selectedYear = data[0].years;

    let schoolsNames = data[0].schools.map((element) => element.schoolName);
    let siteName = data[0].schools[0].siteName;
    let schoolId = data[0].schools[0].schoolId;

    this.setState({ data, selectedYear, schoolsNames, siteName, schoolId });

    let [startYear, endYear] = selectedYear.split("-");

    let decodedAccount = {
      startYear,
      endYear,
      teacherId: this.context.account.teacherId,
      siteName,
      schoolId,
    };

    this.context.change(decodedAccount);
  };

  handleSelectYear = async (year) => {
    let { data } = this.state;
    let yearInfo = data.find(
      (element) => element.years.replace("-", " - ") === year
    );

    let schoolsNames = yearInfo.schools.map((element) => element.schoolName);
    let siteName = yearInfo.schools[0].siteName;
    let schoolId = yearInfo.schools[0].schoolId;

    this.setState({ schoolsNames, selectedYear: year, siteName, schoolId });

    let [startYear, endYear] = year.split(" - ");

    let decodedAccount = {
      startYear,
      endYear,
      teacherId: this.context.account.teacherId,
      siteName,
      schoolId,
    };
    sessionStorage.setItem("selectedYear", year);
    sessionStorage.setItem("siteName", siteName);
    sessionStorage.setItem("schoolId", schoolId);
    this.context.change(decodedAccount);
  };

  handleSelectSchoolName = (selectedSchool) => {
    let { data, selectedYear } = this.state;
    selectedYear = selectedYear.replace(" - ", "-");
    data = data.find((element) => element.years === selectedYear);
    let schoolInfo = data.schools.find(
      (element) => element.schoolName === selectedSchool
    );
    let siteName = schoolInfo.siteName;
    let schoolId = schoolInfo.schoolId;
    this.setState({ siteName, schoolId });

    let { startYear, endYear, teacherId } = this.context.account;

    let account = {
      startYear,
      endYear,
      teacherId,
      siteName,
      schoolId,
    };
    this.context.change(account);
  };

  render() {
    let { data, schoolsNames } = this.state;
    let years = data.map((element) => element.years.replace("-", " - "));
    return (
      <div id="year">
        <h4>Teaching period</h4>
        <div id="years" className="teacher-years">
          <Selection
            heading={this.state.heading}
            handleSelect={this.handleSelectYear}
            data={years}
          />
          <Selection
            heading={this.state.heading}
            handleSelect={this.handleSelectSchoolName}
            data={schoolsNames}
          />
        </div>
      </div>
    );
  }
}

export default TeachPeriod;
