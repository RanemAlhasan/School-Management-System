import React, { Component } from "react";
import { editContent } from "../../../services/schoolService";
import Selection from "../../Selection";
import PeriodContext from "../../../contexts/periodContext";
import { toast, ToastContainer } from "react-toastify";

class EditContent extends Component {
  static contextType = PeriodContext;

  state = {
    header: "",
    body: "",
    type: "",
    id: "",

    types: ["Primary", "Secondary"],
  };

  componentDidMount = () => {
    let { header, body, type, id } = this.props.history.location.state.content;
    this.setState({ header, body, type, id });
  };

  handleContentType = (type) => {
    this.setState({ type });
  };

  handleInputChange = ({ currentTarget }) => {
    this.setState({ [currentTarget.name]: currentTarget.value });
  };

  handleSubmit = async () => {
    try {
      let { type, header, body, id } = this.state;
      let newObj = { type, header, body, id };
      await editContent(this.context.siteName, newObj);
      toast.success("Content has been updated successfully");
    } catch (error) {}
  };

  render() {
    let { header, body, types, type } = this.state;

    return (
      <div id="public-content">
        <ToastContainer />
        <div className="edit">
          <h4>Select content type</h4>
          <Selection
            data={types}
            handleSelect={this.handleContentType}
            heading={type}
          />
          <div className="article">
            <div className="article-icon">
              <i className="las la-star" />
            </div>
            <textarea
              type="text"
              onChange={this.handleInputChange}
              placeholder="Content Header"
              name="header"
              value={header}
            />
            <textarea
              type="text"
              onChange={this.handleInputChange}
              placeholder="Content Body"
              name="body"
              value={body}
            />
          </div>
          <button onClick={this.handleSubmit}>Edit Content</button>
        </div>
      </div>
    );
  }
}

export default EditContent;
