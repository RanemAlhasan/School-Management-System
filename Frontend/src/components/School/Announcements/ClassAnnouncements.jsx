import React, { Component } from "react";
import PeriodContext from "../../../contexts/periodContext";
import Selection from "../../Selection";
import { getClassesAnnouncements } from "../../../services/announcementsService";

class ClassAnnouncements extends Component {
  static contextType = PeriodContext;

  state = {
    classes: [],
    classesNames: [],
    selectedClass: "",
  };

  componentDidMount = async () => {
    let years = this.context.account;
    let classes = await getClassesAnnouncements(years, this.context.siteName);
    let classesNames = classes.map((element) => element.className);
    let selectedClass = classesNames[0];
    this.setState({ classes, classesNames, selectedClass });
    this.props.setDestinationId(classes[0] ? classes[0].schoolClassId : -1);
  };

  handleSelectClass = (selectedClass) => {
    let id = this.state.classes.find(
      (element) => element.className === selectedClass
    ).schoolClassId;
    this.setState({ selectedClass });
    this.props.setDestinationId(id);
  };

  render() {
    let { classesNames } = this.state;
    return (
      <Selection data={classesNames} handleSelect={this.handleSelectClass} />
    );
  }
}

export default ClassAnnouncements;
