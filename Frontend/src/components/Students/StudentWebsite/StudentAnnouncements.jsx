import React, { Component } from "react";
import Selection from "../../Selection";
import PeriodContext from "../../../contexts/periodContext";
import { getStudentAnnouncements } from "../../../services/studentService";
import { getDefaultValues } from "../../../services/defaultContextValues";
import ViewAnnouncements from "../../ViewAnnouncements";

class StudentAnnouncements extends Component {
  static contextType = PeriodContext;

  state = {
    announcements: [],
    source: ["School", "Teacher"],

    selectedSource: "",
  };

  componentDidMount = async () => {
    let type = this.props.parent ? "parent" : "student";
    let { account } = this.context;
    let newObj = await getDefaultValues(account, type);
    let selectedSource = "School";

    let announcements = await getStudentAnnouncements(newObj, type);

    this.setState({ selectedSource, announcements });
  };

  filterAnnouncements = () => {
    let { announcements, selectedSource } = this.state;
    if (selectedSource === "School") {
      return announcements.filter(
        (item) =>
          item.sourceTeacherInYearId === null &&
          item.announcementType.name !== "Scientific Content" &&
          item.announcementType.name !== "Homework"
      );
    }
    return announcements.filter(
      (item) =>
        item.sourceSchoolId === null &&
        item.announcementType.name !== "Scientific Content" &&
        item.announcementType.name !== "Homework"
    );
  };

  handleSelectSource = (selectedSource) => {
    this.setState({ selectedSource });
  };

  redirection = (element) => {
    this.props.history.push({
      pathname: "Announcements/view",
      state: { announcement: element },
    });
  };

  render() {
    let { source } = this.state;
    let announcements = this.filterAnnouncements();

    return (
      <div className="student-announcements">
        <h4>Select announcement source</h4>
        <Selection data={source} handleSelect={this.handleSelectSource} />
        <ViewAnnouncements
          announcements={announcements}
          redirection={this.redirection}
        />
      </div>
    );
  }
}

export default StudentAnnouncements;
