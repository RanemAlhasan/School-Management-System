import React from "react";
import Form from "../../components/Form";
import {
  sendMyClasses,
  getGeneralClasses,
} from "../../services/classesService";
import Grade from "../Grade";
import PeriodContext from "../../contexts/periodContext";
import { ToastContainer, toast } from "react-toastify";

class AddClasses extends Form {
  static contextType = PeriodContext;

  state = {
    grades: [],
    checked: [],
  };

  componentDidMount = async () => {
    try {
      let { data } = await getGeneralClasses();
      this.setState({ grades: data });
    } catch (error) {}
  };

  handleClick = (grade) => {
    let checked = [...this.state.checked];
    if (!checked.find((element) => element === grade.id)) {
      checked.push(grade.id);
    } else checked = checked.filter((element) => element !== grade.id);
    this.setState({ checked });
  };

  completeSubmit = async () => {
    if (this.props.parentSubmit) {
      this.props.parentSubmit(this.state.checked);
      return;
    }
    try {
      await sendMyClasses(
        this.state.checked,
        this.context.account,
        this.context.siteName
      );
      toast.success("Classes have been added successfully");
    } catch (error) {
      let errorData = error.response.data.error;
      errorData = errorData.map(
        (element) =>
          this.state.grades.find(
            (item) => parseInt(item.id) === parseInt(element)
          ).name
      );
      toast.error(`Classes ${errorData} are already added.`);
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <ToastContainer />
        <h4>Select Grades </h4>
        <div id="grades">
          {this.state.grades.map((grade, index) => (
            <Grade
              key={grade["name"]}
              name="grade"
              value={grade["name"]}
              handleClick={() => this.handleClick(grade)}
              active={this.state.checked.find(
                (element) => element === grade.id
              )}
            />
          ))}
        </div>
        {this.renderSubmitButton("Submit")}
      </form>
    );
  }
}

export default AddClasses;
