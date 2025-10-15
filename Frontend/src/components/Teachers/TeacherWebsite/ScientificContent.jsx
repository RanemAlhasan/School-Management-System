import React, { Component } from "react";
import PeriodContext from "../../../contexts/periodContext";
import {
  getScientificId,
  sendTeacherAnnouncements,
} from "../../../services/announcementsService";
import { toast, ToastContainer } from "react-toastify";
import {
  getTeacherClasses,
  getTeacherClassroomsId,
} from "../../../services/teacherService";
import { getTeacherDefaultValues } from "../../../services/defaultContextValues";
import Selection from "../../Selection";

class ScientificContent extends Component {
  static contextType = PeriodContext;

  state = {
    heading: "",
    body: "",
    file: "",
    classes: [],
    classrooms: [],
    classroomsNumber: [],
    attachments: [],

    selectedClass: "",
    selectedClassroom: "",
  };

  componentDidMount = async () => {
    // Account
    let account = await getTeacherDefaultValues(this.context.account);

    // Classes
    let classes = await getTeacherClasses(account);
    let selectedClass = classes[0];

    // Classrooms
    let classrooms = await getTeacherClassroomsId(account, selectedClass);
    let classroomsNumber = classrooms.map((element) => element.classroomNumber);
    let selectedClassroom = classroomsNumber[0];
    this.setState({
      classes,
      classrooms,
      classroomsNumber,
      selectedClassroom,
      selectedClass,
    });
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
    let {
      heading,
      body,
      attachments,
      selectedClassroom,
      classrooms,
    } = this.state;
    let id = classrooms.find(
      (element) => element.classroomNumber === selectedClassroom
    );
    id = id ? id.classroomId : "";
    if (!id) {
      toast.error("Select a valid destination");
      return;
    }

    let scientificId = await getScientificId();
    try {
      await sendTeacherAnnouncements(
        heading,
        body,
        attachments,
        id,
        this.context.account,
        scientificId
      );
      toast.success("Scientific content has been sent successfully");
    } catch (error) {}
  };

  handleSelectClass = async (selectedClass) => {
    let classrooms = await getTeacherClassroomsId(
      this.context.account,
      selectedClass
    );
    let classroomsNumber = classrooms.map((element) => element.classroomNumber);
    let selectedClassroom = classroomsNumber[0];
    this.setState({
      classrooms,
      classroomsNumber,
      selectedClassroom,
      selectedClass,
    });
  };

  handleSelectClassroom = (selectedClassroom) => {
    this.setState({ selectedClassroom });
  };

  render() {
    let { heading, body, file, classes, classroomsNumber } = this.state;
    return (
      <div id="announcements">
        <div className="selection-container">
          <Selection data={classes} handleSelect={this.handleSelectClass} />
          <Selection
            data={classroomsNumber}
            handleSelect={this.handleSelectClassroom}
          />
        </div>
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

export default ScientificContent;
