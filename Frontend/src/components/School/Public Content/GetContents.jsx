import React, { Component } from "react";
import { getPublicContent } from "../../../services/schoolService";
import PeriodContext from "../../../contexts/periodContext";
import { ToastContainer } from "react-toastify";

class GetContent extends Component {
  static contextType = PeriodContext;

  state = {
    contents: [],
  };

  componentDidMount = async () => {
    let contents = await getPublicContent(this.context.siteName);
    this.setState({ contents });
  };

  redirection = (element) => {
    this.props.history.push({
      pathname: "Viewcontent/edit",
      state: { content: element },
    });
  };

  render() {
    let { contents } = this.state;
    return (
      <div id="get-content">
        <ToastContainer />
        <div className="content-part">
          {contents.map((element) => {
            return (
              <div className="article">
                <div className="article-icon">
                  <i
                    className="las la-edit"
                    onClick={() => this.redirection(element)}
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

export default GetContent;
