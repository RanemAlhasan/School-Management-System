import React from "react";
import { decodeClasses, getMyClasses } from "../../services/classesService";
import Selection from "../Selection";
import Form from "../Form";
import Joi from "joi-browser";
import ClassroomForm from "./ClassroomForm";
import { addClassrooms } from "../../services/classroomsService";
import { ToastContainer, toast } from "react-toastify";
import PeriodContext from "../../contexts/periodContext";

class AddClassrooms extends Form {
  static contextType = PeriodContext;

  state = {
    data: [],
    selected: "",

    account: {
      number: "",
    },
    errors: {
      number: "",
    },
    result: [],
  };

  schema = {
    number: Joi.number().min(1).required(),
  };

  componentDidMount = async () => {
    try {
      let { data } = await getMyClasses(
        this.context.account,
        this.context.siteName
      );
      let classes = decodeClasses(data);
      let selected = classes[0];
      this.setState({ data: classes, selected });
    } catch (error) {}
  };

  handleSelect = (selected) => {
    if (this.state.selected !== selected)
      this.setState({ account: { number: 1 }, selected });
  };

  handleCapacityChange = (capacity, number, index) => {
    let result = [...this.state.result];
    result[index] = { number: number, capacity: capacity };
    if (!capacity && !number) {
      result.filter(
        (element) => element.number !== "" && element.capacity !== ""
      );
    }
    this.setState({ result });
  };

  handleSubmit = async () => {
    let number = this.state.account.number;
    let result = this.state.result;
    result = result.filter(
      (element) => element.capacity !== "" || element.number !== ""
    );
    if (
      number <= 0 ||
      result.find((element) => element.capacity <= 0 || element.number < 0) ||
      result.find((element) => element.number && !element.capacity) ||
      result.find((element) => !element.number && element.capacity)
    ) {
      toast.error("Please fill out the form correctly");
      return;
    }
    try {
      await addClassrooms(
        result,
        this.context.account,
        this.state.selected,
        this.context.siteName
      );
      toast.success("Classrooms have been added");
    } catch (error) {
      let errors = error.response.data.error;
      toast.error(`Classrooms number ${errors} are already added`);
    }
  };

  renderClassroomForms = () => {
    let data = [];
    for (let i = 0; i < this.state.account.number; i++) {
      data.push(i);
    }
    return data;
  };

  renderButton = () => {
    return this.state.account.number ? (
      <button onClick={this.handleSubmit} type="submit">
        Submit
      </button>
    ) : null;
  };

  renderData = () => {
    return this.state.data.length ? (
      <React.Fragment>
        <h4>Select a class</h4>
        <Selection data={this.state.data} handleSelect={this.handleSelect} />
        {this.renderInput(
          "number",
          this.state.account.number,
          "Classrooms number",
          this.state.errors.number,
          "number"
        )}
        <div id="classrooms-container">
          {this.renderClassroomForms().map((element, index) => {
            return (
              <ClassroomForm
                key={element}
                index={index}
                handleCapacityChange={this.handleCapacityChange}
              />
            );
          })}
        </div>
        {this.renderButton()}
      </React.Fragment>
    ) : null;
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        {!this.state.data.length && <h1 id="empty">Add your classes first</h1>}
        <div id="add-classrooms">{this.renderData()}</div>
      </React.Fragment>
    );
  }
}

export default AddClassrooms;
