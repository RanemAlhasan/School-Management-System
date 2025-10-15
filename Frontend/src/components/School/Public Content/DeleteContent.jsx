import React, { Component } from "react";
import {
  deletePublicContent,
  getPublicContent,
} from "../../../services/schoolService";
import PeriodContext from "../../../contexts/periodContext";
import { toast, ToastContainer } from "react-toastify";

class DeleteContent extends Component {
  static contextType = PeriodContext;

  state = {
    contents: [],
  };

  componentDidMount = async () => {
    let contents = await getPublicContent(this.context.siteName);
    this.setState({ contents });
  };

  deleteContent = async (element) => {
    let { contents } = this.state;
    contents = contents.filter((content) => content.id !== element.id);
    this.setState({ contents });
    try {
      await deletePublicContent(this.context.siteName, element.id);
      toast.success("Content has been deleted successfully");
    } catch (error) {}
  };

  render() {
    let { contents } = this.state;
    return (
      <div id="get-content" className="delete-content">
        <ToastContainer />
        <div className="content-part">
          {contents.map((element) => {
            return (
              <div className="article">
                <div className="article-icon">
                  <i
                    className="las la-trash-alt"
                    onClick={() => this.deleteContent(element)}
                  />
                </div>
                <p>Content Type : {element.type}</p>
                <p>Content Header : {element.header}</p>
                <p>Content Body : {element.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default DeleteContent;
