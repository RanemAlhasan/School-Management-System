import React, { Component } from "react";
import { getFile } from "../services/announcementsService";

class SpecificAnnouncement extends Component {
  state = {
    announcement: "",
    done: false,
  };

  componentDidMount = async () => {
    let announcement = this.props.history.location.state.announcement;
    this.setState({ announcement, done: true });
  };

  getFile = async (path) => {
    let data = await getFile(path);
    window.open(data);
  };

  renderAttachments = (element, index) => {
    let innerText = "";
    if (element.path.endsWith("pdf")) innerText = "Download";
    else innerText = "View Image";
    return (
      <div key={index}>
        <button onClick={() => this.getFile(element.path)}>
          {index} - {innerText}
        </button>
      </div>
    );
  };

  render() {
    let { announcement } = this.state;
    return (
      <div className="specific-announcement">
        {announcement.heading && (
          <p>
            <span>Heading</span>
            <span>{announcement.heading}</span>
          </p>
        )}
        {announcement.body && (
          <p>
            <span>Content</span>
            <span>{announcement.body}</span>
          </p>
        )}
        <p>
          <span>Date</span>
          <span>{new Date(announcement.date).toDateString()}</span>
        </p>
        {announcement.attachments && announcement.attachments.length !== 0 && (
          <div>
            <span className="at">Attachments</span>
            <div className="at-container">
              {announcement.attachments &&
                announcement.attachments.map((element, index) =>
                  this.renderAttachments(element, index + 1)
                )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SpecificAnnouncement;
