import React, { Component } from "react";

class StudentsPromotionTable extends Component {
  state = {};
  render() {
    let {
      students,
      selectStudent,
      result,
      selectAll,
      handleSelectAll,
    } = this.props;
    console.log(selectAll);
    return (
      <table>
        <thead>
          <tr>
            <th>Student's Name</th>
            <th>
              <button onClick={handleSelectAll}>
                {!selectAll ? "Select All" : "Deselect All"}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td
                colSpan="2"
                onClick={() => selectStudent(student)}
                style={{
                  backgroundColor: result.get(student.studentId)
                    ? "#2d9c4d"
                    : "#282424",
                }}
              >
                {student.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default StudentsPromotionTable;
