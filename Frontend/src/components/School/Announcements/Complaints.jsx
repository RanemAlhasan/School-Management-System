import React, { Component } from "react";
import { getSchoolComplaints } from "../../../services/schoolService";
import PeriodContext from "../../../contexts/periodContext";
import ViewAnnouncements from "../../ViewAnnouncements";

class Complaints extends Component {
  static contextType = PeriodContext;

  state = {
    announcements: [],
  };

  componentDidMount = async () => {
    let announcements = await getSchoolComplaints(
      this.context.account,
      this.context.siteName
    );
    this.setState({ announcements });
  };

  redirection = (element) => {
    this.props.history.push({
      pathname: "complaints/view",
      state: { announcement: element },
    });
  };

  render() {
    let { announcements } = this.state;

    return (
      <React.Fragment>
        <h4>Students complaints</h4>
        <ViewAnnouncements
          announcements={announcements}
          redirection={this.redirection}
        />
      </React.Fragment>
    );
  }
}

export default Complaints;
