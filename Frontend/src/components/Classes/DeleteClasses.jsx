import React, { Component } from "react";
import { deleteClass, getClassesDeletion } from "../../services/classesService";
import PeriodContext from "../../contexts/periodContext";
import { toast, ToastContainer } from "react-toastify";

class DeleteClasses extends Component {
  static contextType = PeriodContext;
  state = {
    classes: [],
    clicked: [],
  };

  componentDidMount = async () => {
    let { siteName, account } = this.context;
    let classes = await getClassesDeletion(siteName, account);
    this.setState({ classes });
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

  removeClass = async (name, index) => {
    let classes = [...this.state.classes];
    let clicked = [...this.state.clicked];
    clicked[index] = false;
    try {
      await deleteClass(
        name.replace(" ", "_"),
        this.context.siteName,
        this.context.account
      );
      classes = classes.filter((element) => element.name !== name);
      this.setState({ classes, clicked });
      toast.success("Class has been removed successfully");
    } catch (error) {
      toast.error("You can't remove this class");
    }
  };

  render() {
    let { classes, clicked } = this.state;
    return (
      <div id="get-content" className="delete-content">
        <ToastContainer />
        <div className="content-part">
          {classes.map((element, index) => {
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
                    <p>Are you sure you want to delete this class ?</p>
                    <div className="button-container">
                      <button
                        style={{
                          margin: "0 10px 0 0",
                          display: "inline",
                          width: "45%",
                          backgroundColor: "#e74c3c",
                        }}
                        onClick={() => this.removeClass(element.name, index)}
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

export default DeleteClasses;
