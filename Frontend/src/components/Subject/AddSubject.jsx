import React from "react";
import {
  getGeneralCategories,
  sendMySubjects,
} from "../../services/subjectsService";
import Selection from "../Selection";
import Form from "../Form";
import Joi from "joi-browser";
import SubjectForm from "./SubjectForm";
import { decodeClasses, getMyClasses } from "../../services/classesService";
import PeriodContext from "../../contexts/periodContext";
import { ToastContainer, toast } from "react-toastify";

class AddSubject extends Form {
  static contextType = PeriodContext;

  state = {
    classes: [],
    categoriesWithId: [],
    categoriesName: [],
    selectedClass: "",
    subjects: [],
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
      try {
        let { data } = await getGeneralCategories();
        let categoriesName = data.map((element) => element.name);
        let selectedClass = classes[0];
        this.setState({
          classes,
          categoriesWithId: data,
          categoriesName,
          selectedClass: selectedClass ? selectedClass : "None",
        });
      } catch (error) {}
    } catch (error) {}
  };

  handleSelectClass = (selected) => {
    this.setState({ selectedClass: selected });
  };

  renderSubjectForms = () => {
    let data = [];
    for (let i = 0; i < this.state.account.number; i++) {
      data.push(i);
    }
    return data;
  };

  handleSendSubjects = async (event) => {
    event.preventDefault();
    let result = [...this.state.result];
    let newResult = [];
    if (result.length !== parseInt(this.state.account.number)) {
      for (let i = 0; i < this.state.account.number; i++) {
        newResult[i] = result[i];
      }
    } else newResult = result;

    try {
      await sendMySubjects(
        this.context.account,
        this.state.selectedClass,
        newResult,
        this.context.siteName
      );
      toast.success("subjects have been added successfully");
    } catch (error) {}
  };

  // Handle Category Change
  handleCategoryChange = (categoryName, index) => {
    let { categoriesWithId } = this.state;
    let result = [...this.state.result];
    let decodedResult = { ...result[index] };
    let categoryId = categoriesWithId.find(
      (category) => category.name === categoryName
    ).id;
    decodedResult["categoryId"] = categoryId;
    result[index] = decodedResult;
    this.setState({ result });
  };

  // Handle Subject Name Change
  handleNameChange = (name, index) => {
    let result = [...this.state.result];
    let decodedResult = { ...result[index] };
    decodedResult["name"] = name;
    result[index] = decodedResult;
    this.setState({ result });
  };

  // Handle Semester Change
  handleSemesterChange = (checkedSemester, index) => {
    let result = [...this.state.result];
    let decodedResult = { ...result[index] };
    decodedResult["checkedSemesters"] = checkedSemester;
    result[index] = decodedResult;
    this.setState({ result });
  };

  renderButton = () => {
    return this.state.account.number ? (
      <button onClick={this.handleSendSubjects} type="submit">
        Submit
      </button>
    ) : null;
  };

  handleCompleteChange = (value, name) => {
    let result = [...this.state.result];
    // console.log(result);
    let newResult = [];
    for (let i = 0; i < value; i++) {
      newResult[i] = result[i];
    }
    //  console.log(newResult);
  };

  render() {
    return (
      <form onSubmit={this.handleSendSubjects} autoComplete="off">
        <ToastContainer />
        <div id="add-classrooms">
          <h4>Select a class</h4>
          <Selection
            data={this.state.classes}
            handleSelect={this.handleSelectClass}
          />
          {this.renderInput(
            "number",
            this.state.account.number,
            "Subjects number",
            this.state.errors.number,
            "number"
          )}

          <div id="classrooms-container">
            {this.renderSubjectForms().map((element, index) => {
              return (
                <SubjectForm
                  key={element}
                  index={index}
                  categoriesName={this.state.categoriesName}
                  handleCategoryChange={(categoryName) =>
                    this.handleCategoryChange(categoryName, index)
                  }
                  handleNameChange={(name) =>
                    this.handleNameChange(name, index)
                  }
                  handleSemesterChange={(checkedSemester) =>
                    this.handleSemesterChange(checkedSemester, index)
                  }
                />
              );
            })}
          </div>
          {this.renderButton()}
        </div>
      </form>
    );
  }
}

export default AddSubject;
