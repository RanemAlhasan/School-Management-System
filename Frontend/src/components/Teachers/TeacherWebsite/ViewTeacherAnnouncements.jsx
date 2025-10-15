import React, { Component } from "react";
import PeriodContext from "../../../contexts/periodContext";
import { getTeacherDefaultValues } from "../../../services/defaultContextValues";
import ViewAnnouncements from "../../ViewAnnouncements";
import { getTeacherAnnouncements } from "../../../services/announcementsService";

class ViewTeacherAnnouncements extends Component {
  static contextType = PeriodContext;

  state = {
    announcements: [],
  };

  componentDidMount = async () => {
    let { account } = this.context;
    let newObj = await getTeacherDefaultValues(account);

    let announcements = await getTeacherAnnouncements(newObj);
    this.setState({ announcements });
  };

  redirection = (element) => {
    this.props.history.push({
      pathname: "ViewAnnouncements/specific",
      state: { announcement: element },
    });
  };

  render() {
    let { announcements } = this.state;

    return (
      <div className="teacher-announcements">
        <ViewAnnouncements
          announcements={announcements}
          redirection={this.redirection}
        />
      </div>
    );
  }
}

export default ViewTeacherAnnouncements;
