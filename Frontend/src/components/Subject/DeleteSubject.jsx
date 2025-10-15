import React, { Component } from "react";
import {
  deleteSubject,
  decodeSubjectsDeletion,
  getMySubjectsDeletion,
} from "../../services/subjectsService";
import { decodeClasses, getMyClasses } from "../../services/classesService";
import PeriodContext from "../../contexts/periodContext";
import { toast, ToastContainer } from "react-toastify";
import Selection from "../Selection";
class DeleteSubject extends Component {
  static contextType = PeriodContext;
  state = {
    subjects: [],
    classes: [],
    clicked: [],
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
        let { data: secondData } = await getMySubjectsDeletion(
          this.context.account,
          classes[0],
          this.context.siteName
        );
        let result = decodeSubjectsDeletion(secondData);
        this.setState({
          subjects: result,
          classes,
          heading: classes[0],
        });
      } catch (error) {}
      this.setState({
        classes,
        heading: classes[0],
      });
    } catch (error) {}
  };

  handleSelect = async (heading) => {
    try {
      let { data } = await getMySubjectsDeletion(
        this.context.account,
        heading,
        this.context.siteName
      );
      console.log(data);
      let result = decodeSubjectsDeletion(data);
      console.log(result);
      this.setState({ subjects: result, heading });
    } catch (error) {}
    this.setState({ heading });
  };

  confirmation = (index) => {
    let clicked = [...this.state.clicked];
    clicked[index] = true;
    this.setState({ clicked });
  };

  cancelDeletion = (index) => {
    let clicked = [...this.state.clicked];
    clicked[index] = false;
    this.setState({ clicked });
  };

  removeSubject = async (id, index) => {
    let subjects = [...this.state.subjects];
    let clicked = [...this.state.clicked];
    clicked[index] = false;
    let heading = this.state.heading;
    // subjectInYearId, siteName, { startYear, endYear },className
    try {
      await deleteSubject(
        this.context.siteName,
        this.context.account,
        heading,
        id
      );
      subjects = subjects.filter(
        (element) => parseInt(element.id) !== parseInt(id)
      );
      console.log(subjects);
      this.setState({ subjects, clicked });
      toast.success("Subject has been removed successfully");
    } catch (error) {
      console.log(error);
      toast.error("You can't remove this subject");
    }
  };
  renderSelection = () => {
    return this.state.classes.length ? (
      <Selection handleSelect={this.handleSelect} data={this.state.classes} />
    ) : null;
  };
  removeOrNo = () => {
    if (!this.state.subjects.length) {
      return <h1 id="empty">No subjects to delete</h1>;
    }
    let { subjects, clicked } = this.state;
    return (
      <div className="content-part">
        {subjects.map((element, index) => {
          return (
            <div className="article" key={index}>
              <div className="article-icon">
                <i
                  className="las la-trash-alt"
                  onClick={() => this.confirmation(index)}
                />
              </div>
              <p>{element.name}</p>
              {clicked[index] && (
                <React.Fragment>
                  <p>Are you sure you want to delete this subject ?</p>
                  <div className="button-container">
                    <button
                      style={{
                        margin: "0 10px 0 0",
                        display: "inline",
                        width: "45%",
                        backgroundColor: "#e74c3c",
                      }}
                      onClick={() => this.removeSubject(element.id, index)}
                    >
                      Yes
                    </button>
                    <button
                      style={{
                        margin: "0",
                        display: "inline",
                        width: "45%",
                        backgroundColor: "#e74c3c",
                      }}
                      onClick={() => this.cancelDeletion(index)}
                    >
                      No
                    </button>
                  </div>
                </React.Fragment>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div id="get-content" className="delete-content">
        <ToastContainer />
        {this.renderSelection()}
        {this.removeOrNo()}
      </div>
    );
  }
}

export default DeleteSubject;
