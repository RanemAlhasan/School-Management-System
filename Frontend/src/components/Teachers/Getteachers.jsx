import React, { Component } from "react";
import { getMyTeachers, decodeMyTeachers } from "../../services/teacherService";
import PeriodContext from "../../contexts/periodContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

class GetTeachers extends Component {
  static contextType = PeriodContext;

  state = {
    teachers: [],
    search: "",
  };

  componentDidMount = async () => {
    try {
      let { data } = await getMyTeachers(
        this.context.account,
        this.context.siteName
      );
      let result = decodeMyTeachers(data);
      this.setState({
        teachers: result,
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleSearchChange = ({ currentTarget }) => {
    this.setState({ search: currentTarget.value });
  };

  renderInput = () => {
    if (!this.state.teachers.length) {
      return <h1 id="empty">No teachers to show</h1>;
    }
    return (
      <div className="selection-part1">
        <input
          type="text"
          placeholder="Search teacher"
          onChange={this.handleSearchChange}
        />
      </div>
    );
  };

  renderTeachers = () => {
    if (!this.state.teachers.length) {
      return <h1 id="empty">No teachers to show</h1>;
    }

    let teachers = this.state.teachers;
    teachers = teachers.filter((teachers) =>
      teachers.name
        .toLowerCase()
        .includes(this.state.search.toLocaleLowerCase())
    );
    return (
      <div id="info-container">
        {teachers.map((element) => {
          return (
            <div className="info" key={element.email}>
              <div className="title">
                <i className="fa fa-star" />
              </div>
              <div className="element">
                <p>{element.name}</p>
                <a href={`mailto:${element.email}`}>{element.email}</a>
                <p>{element.phoneNumber}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div id="get-teachers">
        <ToastContainer />
        {this.renderInput()}
        {this.renderTeachers()}
      </div>
    );
  }
}

export default GetTeachers;
