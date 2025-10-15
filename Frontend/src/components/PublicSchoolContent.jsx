import React, { Component } from "react";
import img from "../images/school.jpg";
import { getPublicContent, getPublicInfo } from "../services/schoolService";

class PublicSchoolContent extends Component {
  state = {
    contents: [],
    primary: [],
    secondary: [],
    info: {},
  };

  componentDidMount = async () => {
    let name = this.props.match.params.name;
    let contents = await getPublicContent(name);
    let info = await getPublicInfo(name);
    let primary = [],
      secondary = [];
    contents.forEach((element) => {
      if (element.type === "Primary") primary.push(element);
      else secondary.push(element);
    });
    this.setState({ primary, secondary, info });
  };

  render() {
    let { primary, secondary, info } = this.state;

    return (
      <div className="public-school-info">
        <div
          id="public-school-content"
          style={{
            background: `linear-gradient(to left,rgba(0,0,0.6),rgba(0,0,0,0.6)),url(${img})`,
          }}
        >
          <p className="school-name">{info.school && info.school.schoolName}</p>
        </div>
        {primary.map((element, index) => (
          <div className="content" key={index}>
            <h2>{element.header}</h2>
            <article>{element.body}</article>
          </div>
        ))}

        <div className="content-container">
          {secondary.map((element, index) => (
            <div className="secondary" key={index}>
              <div className="article-icon">
                <i className="fas fa-star" />
              </div>
              <p>{element.header}</p>
              <p>{element.body}</p>
            </div>
          ))}
        </div>
        <footer>
          <h2>Contact</h2>
          <section className="contact">
            <div>
              <p>Email Us</p>
              <a href={`mailto:${info.email}`}>{info.email}</a>
            </div>
            <div>
              <p>Call Us</p>
              <p>{info.phoneNumber}</p>
            </div>
            <div>
              <p>Visit Us</p>
              <a href={info.school ? info.school.facebookPage : ""}>
                <i className="lab la-facebook-f" />
                acebook
              </a>
            </div>
          </section>
        </footer>
      </div>
    );
  }
}

export default PublicSchoolContent;
