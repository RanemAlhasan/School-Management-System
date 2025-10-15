import React, { Component } from "react";
import PeriodContext from "../../../contexts/periodContext";
import CrudList from "../../CrudList";
import { Redirect, Route, Switch } from "react-router-dom";
import ClassAnnouncements from "./ClassAnnouncements";
import ClassoomAnnouncements from "./ClassroomAnnouncements";
import StudentAnnouncements from "./StudentAnnouncements";
import {
  getExamId,
  sendAnnouncements,
} from "../../../services/announcementsService";
import { ToastContainer, toast } from "react-toastify";
import Date from "../../Date";
import TeacherAnnouncements from "./TeacherAnnouncements";

class Announcements extends Component {
  static contextType = PeriodContext;

  state = {
    destination: ["Class", "Classroom", "Student", "Teacher"],
    attachments: [],

    heading: "",
    file: "",
    body: "",
    selectedDestination: "Class",
    destinationId: "",
    date: "",
  };

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect to={`/school/${this.context.siteName}/Announcements/Class`} />
      );
    else
      return (
        <Redirect
          to={`/school/${this.context.siteName}/Announcements/${type}`}
        />
      );
  };

  handleInputChange = ({ currentTarget }) => {
    let { name, value } = currentTarget;
    this.setState({ [name]: value });
  };

  customClick = (selectedDestination) => {
    this.setState({ selectedDestination, destinationId: "" });
  };

  setDestinationId = (destinationId) => {
    this.setState({ destinationId });
  };

  handleFileChange = ({ currentTarget }) => {
    this.setState({
      file: currentTarget.value,
      attachments: currentTarget.files,
    });
  };

  sendAnnouncement = async () => {
    let years = this.context.account;
    let {
      selectedDestination,
      destinationId,
      heading,
      body,
      date,
      attachments,
    } = this.state;
    if (destinationId === -1) {
      toast.error("Select a valid destination");
      return;
    }

    if (date === "") {
      toast.error("Select a valid date");
      return;
    }

    let examId = await getExamId();
    try {
      await sendAnnouncements(
        selectedDestination,
        destinationId,
        heading,
        body,
        date,
        attachments,
        years,
        this.context.siteName,
        examId
      );
      toast.success("Announcement has been sent successfully");
    } catch (error) {}
  };

  render() {
    let { destination, heading, body, file, date } = this.state;
    let { siteName } = this.context;
    let type = this.props.match.params.type;

    return (
      <div id="announcements">
        <ToastContainer />
        <CrudList
          list={destination}
          baseURL={`/school/${siteName}/Announcements`}
          customClick={this.customClick}
          type={type}
        />
        <Switch>
          <Route
            path={`/school/${siteName}/Announcements/Class`}
            render={(props) => (
              <ClassAnnouncements
                setDestinationId={this.setDestinationId}
                {...props}
              />
            )}
          />
          <Route
            path={`/school/${siteName}/Announcements/Classroom`}
            render={(props) => (
              <ClassoomAnnouncements
                setDestinationId={this.setDestinationId}
                {...props}
              />
            )}
          />
          <Route
            path={`/school/${siteName}/Announcements/Student`}
            render={(props) => (
              <StudentAnnouncements
                setDestinationId={this.setDestinationId}
                {...props}
              />
            )}
          />
          <Route
            path={`/school/${siteName}/Announcements/Teacher`}
            render={(props) => (
              <TeacherAnnouncements
                setDestinationId={this.setDestinationId}
                {...props}
              />
            )}
          />
          {this.redirectTo()}
        </Switch>
        <Date
          placeholder="Announcements Date"
          name="date"
          value={date}
          handleChange={this.handleInputChange}
        />
        <div className="selection-container">
          <textarea
            type="text"
            name="heading"
            placeholder="Heading"
            value={heading}
            onChange={this.handleInputChange}
          />
          <textarea
            type="text"
            name="body"
            value={body}
            placeholder="Content"
            onChange={this.handleInputChange}
          />
        </div>
        <input
          type="file"
          value={file}
          onChange={this.handleFileChange}
          multiple
        />
        <button onClick={this.sendAnnouncement}>Send</button>
      </div>
    );
  }
}

export default Announcements;
