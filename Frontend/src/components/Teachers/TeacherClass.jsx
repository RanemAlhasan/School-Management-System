import React from "react";
import { toast, ToastContainer } from "react-toastify";
import Grade from "../Grade";
import Form from "../Form";
import {
  getClassesAnnouncements,
  showTeachersInYear,
} from "../../services/announcementsService";
import PeriodContext from "../../contexts/periodContext";
import { sendTeacherClasses } from "../../services/teacherService";
import Selection from "../Selection";

class TeacherClass extends Form {
  static contextType = PeriodContext;

  state = {
    teachers: [],
    grades: [],
    checked: [],

    selectedTeacher: "",
  };

  componentDidMount = async () => {
    let grades = await getClassesAnnouncements(
      this.context.account,
      this.context.siteName
    );

    let teachers = await showTeachersInYear(
      this.context.account,
      this.context.siteName
    );
    this.setState({
      grades,
      teachers,
      selectedTeacher: teachers[0] ? teachers[0].name : "None",
    });
  };

  handleClick = (grade) => {
    let checked = [...this.state.checked];
    if (!checked.find((element) => element === grade.schoolClassId)) {
      checked.push(grade.schoolClassId);
    } else
      checked = checked.filter((element) => element !== grade.schoolClassId);
    this.setState({ checked });
  };

  completeSubmit = async () => {
    let { selectedTeacher, teachers } = this.state;
    let id = teachers.find((element) => element.name === selectedTeacher).id;
    try {
      await sendTeacherClasses(
        id,
        this.state.checked,
        this.context.account,
        this.context.siteName
      );
      toast.success("Teacher has been added to classes successfully");
    } catch (error) {
      toast.error("Teacher has already been added to class");
    }
  };

  handleSelectTeacher = (selectedTeacher) => {
    this.setState({ selectedTeacher });
  };

  render() {
    let { teachers, grades } = this.state;
    console.log(grades);
    let showTeachers = teachers.map((element) => element.name);
    return (
      <div className="teacher-classes">
        <form onSubmit={this.handleSubmit}>
          <ToastContainer />
          <h4>Select a teacher</h4>
          <Selection
            data={showTeachers}
            handleSelect={this.handleSelectTeacher}
          />
          {grades.length !== 0 ? (
            <React.Fragment>
              <h4>Select Grades</h4>
              <div id="grades">
                {this.state.grades.map((grade, index) => (
                  <Grade
                    key={grade["className"]}
                    name="grade"
                    value={grade["className"]}
                    handleClick={() => this.handleClick(grade)}
                    active={this.state.checked.find(
                      (element) => element === grade.schoolClassId
                    )}
                  />
                ))}
              </div>
              {this.renderSubmitButton("Submit")}
            </React.Fragment>
          ) : (
            <h2 style={{ marginLeft: "10px", color: "#db4437" }}>
              Add your classes first
            </h2>
          )}
        </form>
      </div>
    );
  }
}

export default TeacherClass;
