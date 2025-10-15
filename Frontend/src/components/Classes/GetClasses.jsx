import React, { Component } from "react";
import periodContext from "../../contexts/periodContext";
import { decodeClasses, getMyClasses } from "../../services/classesService";
import { ToastContainer } from "react-toastify";
import Info from "../Info";

class GetClasses extends Component {
  static contextType = periodContext;

  state = {
    classes: [],
  };

  componentDidMount = async () => {
    try {
      let { data } = await getMyClasses(
        this.context.account,
        this.context.siteName
      );
      let classes = decodeClasses(data);
      console.log(classes);
      this.setState({ classes });
    } catch (error) {
      console.log("error");
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        {!this.state.classes.length && <h1 id="empty">No classes to show</h1>}
        <Info info={this.state.classes} />
      </React.Fragment>
    );
  }
}

export default GetClasses;
