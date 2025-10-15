import React, { Component } from "react";
import { sendSchoolContent } from "../../../services/schoolService";
import { toast, ToastContainer } from "react-toastify";
import PeriodContext from "../../../contexts/periodContext";
import Selection from "../../Selection";

class PublicContent extends Component {
  static contextType = PeriodContext;

  state = {
    contentType: ["Primary", "Secondary"],
    selectedTypes: [],
    contentCount: "",
    numberArray: [],
    contentInfo: [],
  };

  handleCountChange = ({ currentTarget }) => {
    if (currentTarget.value > 0) {
      let numberArray = [];
      let contentInfo = [...this.state.contentInfo];
      let selectedTypes = [...this.state.selectedTypes];
      for (let i = 0; i < currentTarget.value; i++) {
        numberArray.push(i);
        if (!contentInfo[i]) {
          contentInfo[i] = { header: "", body: "" };
        }
        if (!selectedTypes[i]) selectedTypes[i] = "Primary";
      }
      this.setState({
        contentCount: currentTarget.value,
        numberArray,
        contentInfo,
        selectedTypes,
      });
    }
  };

  handleContentType = (selectedType, index) => {
    let selectedTypes = [...this.state.selectedTypes];
    selectedTypes[index] = selectedType;
    this.setState({ selectedTypes });
  };

  handleHeaderChange = ({ currentTarget }, index) => {
    let contentInfo = [...this.state.contentInfo];
    let info = { ...contentInfo[index] };
    info["header"] = currentTarget.value;
    contentInfo[index] = info;
    this.setState({ contentInfo });
  };

  handleBodyChange = ({ currentTarget }, index) => {
    let contentInfo = [...this.state.contentInfo];
    let info = { ...contentInfo[index] };
    info["body"] = currentTarget.value;
    contentInfo[index] = info;
    this.setState({ contentInfo });
  };

  handleSubmit = async () => {
    let { contentInfo, selectedTypes } = this.state;
    let { siteName } = this.context;
    for (let content of contentInfo) {
      if (!content["header"] || !content["body"]) {
        toast.error("Please fill the data correctly");
        return;
      }
    }
    try {
      await sendSchoolContent(contentInfo, selectedTypes, siteName);
      toast.success("Contents have been added successfully");
    } catch (error) {}
  };

  renderContent = (index) => {
    return (
      <div className="article">
        <ToastContainer />
        <div className="article-icon">
          <i className="fa fa-star" />
        </div>
        <textarea
          type="text"
          value={this.state.contentInfo[index].header}
          onChange={(value) => this.handleHeaderChange(value, index)}
          placeholder="Content Header"
        />
        <textarea
          type="text"
          value={this.state.contentInfo[index].body}
          onChange={(value) => this.handleBodyChange(value, index)}
          placeholder="Content Body"
        />
      </div>
    );
  };

  render() {
    return (
      <div id="public-content">
        <h4>Information count</h4>
        <input
          type="number"
          onChange={this.handleCountChange}
          placeholder="Content Number"
          value={this.state.contentCount}
        />
        <div className="content-container">
          {this.state.numberArray.map((_, index) => {
            return (
              <div className="content-part" key={index}>
                <h4>Select content type</h4>
                <Selection
                  data={this.state.contentType}
                  handleSelect={(element) =>
                    this.handleContentType(element, index)
                  }
                />
                {this.renderContent(index)}
              </div>
            );
          })}
        </div>
        {this.state.contentInfo.length !== 0 && (
          <button onClick={this.handleSubmit}>Set Content</button>
        )}
      </div>
    );
  }
}

export default PublicContent;
