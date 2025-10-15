import React, { Component } from "react";
import { getActiveTimes } from "../../services/generateTableTimes";

class TeacherTimes extends Component {
  state = {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    activeTimes: [],
    checkedTimes: [],
  };

  componentDidMount = () => {
    let activeTimes = getActiveTimes("7:30", 2, 7, 15, 45);
    this.setState({ activeTimes });
  };

  handleClick = (day, time) => {
    let checkedTimes = [...this.state.checkedTimes];
    if (
      !checkedTimes.find(
        (element) => element.day === day && element.time === time
      )
    ) {
      checkedTimes.push({ day, time });
    } else
      checkedTimes = checkedTimes.filter((element) => {
        if (element.day === day && element.time === time) return false;
        return true;
      });
    this.setState({ checkedTimes });
  };

  determineClasses = (day, time) => {
    let { checkedTimes } = this.state;
    if (
      checkedTimes.find(
        (element) => element.day === day && element.time === time
      )
    )
      return "active";
    return "";
  };

  render() {
    return (
      <React.Fragment>
        <h4>Select teacher's available times</h4>
        <table className="teacher-info">
          <thead>
            <tr>
              <th></th>
              {this.state.activeTimes.map((time) => (
                <th key={time}>{time}</th>
              ))}
            </tr>
            {this.state.days.map((day) => (
              <tr key={day}>
                <th>{day}</th>
                {this.state.activeTimes.map((item) => (
                  <td
                    key={item}
                    onClick={() => this.handleClick(day, item)}
                    className={this.determineClasses(day, item)}
                  ></td>
                ))}
              </tr>
            ))}
          </thead>
        </table>
      </React.Fragment>
    );
  }
}

export default TeacherTimes;
