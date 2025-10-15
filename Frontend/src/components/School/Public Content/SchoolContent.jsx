import React, { Component } from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import CrudList from "../../CrudList";
import PeriodContext from "../../../contexts/periodContext";
import PublicContent from "./PublicContent";
import GetContent from "./GetContents";
import EditContent from "./EditContent";
import DeleteContent from "./DeleteContent";

class SchoolContent extends Component {
  static contextType = PeriodContext;

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect
          to={`/school/${this.context.siteName}/SchoolContent/Addcontent`}
        />
      );
    else
      return (
        <Redirect
          to={`/school/${this.context.siteName}/SchoolContent/${type}`}
        />
      );
  };

  state = {};
  render() {
    let type = this.props.match.params.type;

    return (
      <React.Fragment>
        <CrudList
          list={["Add content", "View content", "Delete content"]}
          baseURL={`/school/${this.context.siteName}/SchoolContent`}
          type={type}
        />
        <Switch>
          <Route
            path="/school/:name/SchoolContent/Addcontent"
            component={PublicContent}
          />
          <Route
            path="/school/:name/SchoolContent/Viewcontent/edit"
            component={EditContent}
          />
          <Route
            path="/school/:name/SchoolContent/Viewcontent"
            component={GetContent}
          />
          <Route
            path="/school/:name/SchoolContent/Deletecontent"
            component={DeleteContent}
          />
          <Redirect
            to={`/school/${this.context.siteName}/SchoolContent/Addcontent`}
          />
        </Switch>
        <button style={{ marginLeft: "10px", marginTop: "10px" }}>
          <Link
            to={`/school/${this.context.siteName}/contents`}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            You can visit your public content from this link
          </Link>
        </button>
      </React.Fragment>
    );
  }
}

export default SchoolContent;
