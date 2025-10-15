import React, { Component } from "react";
import PeriodContext from "../../../contexts/periodContext";
import { sendComplaints } from "../../../services/announcementsService";
import { toast, ToastContainer } from "react-toastify";

class Complaints extends Component {
  static contextType = PeriodContext;

  state = {
    heading: "",
    body: "",
    file: "",

    attachments: [],
  };

  handleInputChange = ({ currentTarget }) => {
    let { name, value } = currentTarget;
    this.setState({ [name]: value });
  };

  handleFileChange = ({ currentTarget }) => {
    let attachments = currentTarget.files;
    this.setState({ attachments, file: currentTarget.value });
  };

  handleSend = async () => {
    let { heading, body, attachments } = this.state;
    try {
      await sendComplaints(
        heading,
        body,
        attachments,
        this.context.account.siteName,
        this.context.account.id,
        this.context.account
      );
      toast.success("Complaint has been sent successfully");
    } catch (error) {}
  };

  render() {
    let { heading, body, file } = this.state;
    return (
      <div id="announcements">
        <ToastContainer />
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
        <button onClick={this.handleSend}>Send</button>
      </div>
    );
  }
}

export default Complaints;
