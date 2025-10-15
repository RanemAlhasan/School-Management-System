import React, { Component } from "react";
import periodContext from "../../contexts/periodContext";
import { decodeClasses, getMyClasses } from "../../services/classesService";
import { ToastContainer } from "react-toastify";
import Info from "../Info";
import {
  decodeClassrooms,
  getClassrooms,
} from "../../services/classroomsService";
import Selection from "../Selection";

class GetClasses extends Component {
  static contextType = periodContext;

  state = {
    classes: [],
    classrooms: [],
    heading: "",
  };

  componentDidMount = async () => {
    try {
      let { data } = await getMyClasses(
        this.context.account,
        this.context.siteName
      );
      let classes = decodeClasses(data);
      try {
        let { data: secondData } = await getClassrooms(
          this.context.account,
          classes[0],
          this.context.siteName
        );
        let result = decodeClassrooms(secondData);
        this.setState({ classrooms: result, classes, heading: classes[0] });
      } catch (error) {}
      this.setState({ classes, heading: classes[0] });
    } catch (error) {}
  };

  handleSelect = async (heading) => {
    try {
      let { data } = await getClassrooms(
        this.context.account,
        heading,
        this.context.siteName
      );
      let result = decodeClassrooms(data);
      this.setState({ heading, classrooms: result });
    } catch (error) {}
    this.setState({ heading });
  };

  renderSelection = () => {
    return this.state.classes.length ? (
      <Selection handleSelect={this.handleSelect} data={this.state.classes} />
    ) : null;
  };

  renderClassrooms = () => {
    if (this.state.classes.length && !this.state.classrooms.length) {
      return <h1 id="empty">No classrooms to show</h1>;
    }
    return <Info info={this.state.classrooms} />;
  };

  render() {
    let classesLength = this.state.classes.length;
    return (
      <div id="get-classrooms">
        <ToastContainer />
        {!classesLength && <h1 id="empty">Add your classes first</h1>}
        {this.renderSelection()}
        {this.renderClassrooms()}
      </div>
    );
  }
}

export default GetClasses;
