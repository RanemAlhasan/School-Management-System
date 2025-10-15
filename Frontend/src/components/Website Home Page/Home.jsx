import React, { Component } from "react";
import { Link } from "react-router-dom";
import coverPic from "../../images/cover.jpg";
import managePic from "../../images/managing.png";
import { getRegisteredSchool } from "../../services/schoolService";
import Developer from "./Developer";
import Service from "./Service";

class Home extends Component {
  state = {
    services: [
      {
        iconClass: "las la-calendar",
        heading: "Schedule Generator",
        body:
          "Provide the user with all important data in order to generate weekly and exam schedule",
      },
      {
        iconClass: "las la-scroll",
        heading: "Announcements Sharing",
        body:
          "The ability to share different type of announcements between school, teachers and students",
      },
      {
        iconClass: "las la-print",
        heading: "Reports Exporting",
        body:
          "Export many important reports like marks report, schedules, fees and absence table",
      },
      {
        iconClass: "las la-money-bill-wave",
        heading: "Fees Management",
        body:
          "Determining the classes fees, addition of student's payments and create fees table",
      },
      {
        iconClass: "las la-user-lock",
        heading: "Multiple Users",
        body:
          "Create different types of users including school adminstrator, student, teacher and in loco parentis",
      },
      {
        iconClass: "las la-hourglass-start",
        heading: "Different School Periods",
        body:
          "Managing different school periods and show the correct data accompanying each period",
      },
    ],

    developers: [
      {
        name: "Anwar Hamaj",
        picName: "anwar.jpg",
        email: "anwarhamaj@gmail.com",
        facebook: "https://www.facebook.com/anoar.hg",
        rule: "Frontend Developer",
        technology: "React Js",
      },

      {
        name: "Raghad Alhalabi",
        picName: "raghad.jpg",
        email: "raghadha78@gmail.com",
        facebook: "https://www.facebook.com/raghad.hala",
        rule: "Backend Developer",
        technology: "Node Js",
      },
      {
        name: "Abd Alrahman Shebani",
        picName: "abd.jpg",
        email: "shebaniabdalrahman@gmail.com",
        facebook: "https://www.facebook.com/aboody.sh.5",
        rule: "Frontend Developer",
        technology: "React Js",
      },
      {
        name: "Raed Sbenaty",
        picName: "raed.jpg",
        email: "raeed.sbenaty.963@gmail.com",
        facebook: "https://www.facebook.com/Raed.Sb.06",
        rule: "Backend Developer",
        technology: "Node Js",
      },
      {
        name: "Raneem Alhassan",
        picName: "raneem.jpg",
        email: "almeadeen@gmail.com",
        facebook: "https://www.facebook.com/raneem.elhassan.96",
        rule: "Backend Developer",
        technology: "Node Js",
      },
    ],
    schools: [],
  };

  componentDidMount = async () => {
    let schools = await getRegisteredSchool();
    console.log(schools);
    this.setState({ schools });
  };

  render() {
    return (
      <div id="home">
        <header
          style={{
            backgroundImage: `linear-gradient(to right,rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url(${coverPic})`,
          }}
        >
          <div className="welcome">
            <p>Manage Your School Decently</p>
            <div className="auth">
              <Link to="/Signup">Sign Up</Link>
              <Link to="/login">Log In</Link>
            </div>
          </div>
        </header>
        <div id="main">
          <div className="content-area">
            <div className="content">
              <h2>Best Features</h2>
              <ol>
                <li>Manage whole school operations.</li>
                <li>Powerful students information system.</li>
                <li>Teacher's account creation.</li>
                <li>In loco parentis support.</li>
                <li>Dynamic and helpful data rendering. </li>
              </ol>
            </div>
            <div className="side">
              <img src={managePic} alt="manage pic" />
            </div>
          </div>
          <div className="services">
            {this.state.services.map((element, index) => (
              <Service element={element} key={index} />
            ))}
          </div>
          {this.state.schools.length !== 0 && (
            <React.Fragment>
              <h2 style={{ textAlign: "center", marginTop: "20px" }}>
                Registered School
              </h2>
              <div className="registered-school">
                {this.state.schools.map((element) => (
                  <div className="school">
                    <h2>{element.schoolName}</h2>
                    <Link to={`/school/${element.account.siteName}/contents`}>
                      Visit
                    </Link>
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}
          <div className="developers">
            {this.state.developers.map((element, index) => (
              <Developer person={element} key={index} />
            ))}
          </div>
        </div>
        <footer>
          Created by Schoolink team 2021 &copy; All rights reserved
        </footer>
      </div>
    );
  }
}

export default Home;
