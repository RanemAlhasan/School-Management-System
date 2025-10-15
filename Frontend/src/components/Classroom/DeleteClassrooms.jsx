import React, { Component } from "react";
import PeriodContext from "../../contexts/periodContext";
import { showClasses } from "../../services/marksServices";
import {
  deleteClassroom,
  getClassroomsDeletion,
} from "../../services/classroomsService";
import Selection from "../Selection";
import { toast, ToastContainer } from "react-toastify";

class DeleteClassrooms extends Component {
  static contextType = PeriodContext;
  state = {
    classes: [],
    classrooms: [],

    selectedClass: [],
    clicked: [],
  };

  componentDidMount = async () => {
    let { siteName, account } = this.context;
    let classes = await showClasses(account, siteName);
    let selectedClass = classes[0];
    let classrooms = await getClassroomsDeletion(
      selectedClass,
      siteName,
      account
    );
    this.setState({ classrooms, classes, selectedClass });
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

  removeClassroom = async (number, index) => {
    let classrooms = [...this.state.classrooms];
    let clicked = [...this.state.clicked];
    clicked[index] = false;
    try {
      await deleteClassroom(
        this.state.selectedClass.replace(" ", "_"),
        number,
        this.context.siteName,
        this.context.account
      );
      classrooms = classrooms.filter(
        (element) => parseInt(element.number) !== parseInt(number)
      );
      this.setState({ classrooms, clicked });
      toast.success("Classroom has been removed successfully");
    } catch (error) {
      toast.error("You can't delete this classroom");
    }
  };

  handleSelectClass = async (selectedClass) => {
    let classrooms = await getClassroomsDeletion(
      selectedClass,
      this.context.siteName,
      this.context.account
    );
    this.setState({ classrooms, selectedClass, clicked: [] });
  };

  render() {
    let { classes, classrooms, clicked } = this.state;
    return (
      <div id="get-content" className="delete-content">
        <ToastContainer />
        <Selection data={classes} handleSelect={this.handleSelectClass} />
        <div className="content-part">
          {classrooms.map((element, index) => {
            return (
              <div className="article" key={index}>
                <div className="article-icon">
                  <i
                    className="las la-trash-alt"
                    onClick={() => this.confirmation(index)}
                  />
                </div>
                <p>Classroom number {element.number}</p>
                {clicked[index] && (
                  <React.Fragment>
                    <p>Are you sure you want to delete this classroom ?</p>
                    <div className="button-container">
                      <button
                        style={{
                          margin: "0 10px 0 0",
                          display: "inline",
                          width: "45%",
                          backgroundColor: "#e74c3c",
                        }}
                        onClick={() =>
                          this.removeClassroom(element.number, index)
                        }
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
      </div>
    );
  }
}

export default DeleteClassrooms;
