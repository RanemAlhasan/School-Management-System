import Joi from "joi-browser";
import React from "react";
import Form from "../Form";
import Selection from "../Selection";
import CheckedSemester from "./CheckedSemester";

class SubjectForm extends Form {
  state = {
    semesters: ["First semester", "Second semester"],
    account: {
      subjectName: "",
    },
    errors: {
      subjectName: "",
    },
    checkedSemester: [],
  };

  schema = {
    subjectName: Joi.string().required(),
  };
  componentDidMount = () => {
    let { handleCategoryChange, categoriesName } = this.props;
    handleCategoryChange(categoriesName[0]);
  };

  handleCompleteChange = (value) => {
    this.props.handleNameChange(value);
  };

  handleClick = (index) => {
    let checkedSemester = [...this.state.checkedSemester];
    if (checkedSemester.find((element) => element === index)) {
      checkedSemester = checkedSemester.filter((element) => element !== index);
    } else checkedSemester.push(index);
    this.setState({ checkedSemester });
    this.props.handleSemesterChange(checkedSemester);
  };

  render() {
    let { subjectName } = this.state.account;
    let errors = this.state.errors;
    let { handleCategoryChange, categoriesName } = this.props;

    return (
      <div className="subject">
        <div id="title1">
          <span className="header1">
            <div className="article-icon">
              <i className="fa fa-star" />
            </div>
          </span>
        </div>
        <div className="form">
          <Selection
            data={categoriesName}
            handleSelect={handleCategoryChange}
          />

          {this.renderInput(
            "subjectName",
            subjectName,
            "Subject Name",
            errors.subjectName
          )}

          <div id="grades1">
            {this.state.semesters.map((semester, index) => (
              <CheckedSemester
                key={semester}
                value={semester}
                name="grade"
                handleClick={() => this.handleClick(index + 1)}
                active={this.state.checkedSemester.find(
                  (element) => element === index + 1
                )}
              />
            ))}
          </div>
        </div>
      </div>
      // </div>
    );
  }
}

export default SubjectForm;
