import React from "react";

function SortTable({ students, classrooms }) {
  let studentsInClassroom = [],
    lastReached = 0;
  for (let i = 0; i < classrooms.length; i++) {
    studentsInClassroom[i] = [];
    let j;
    for (j = lastReached; j < lastReached + classrooms[i].studentsCount; j++)
      studentsInClassroom[i].push(students[j]);
    lastReached = j;
  }

  return (
    <div className="sort-table">
      <table>
        <tbody>
          {classrooms.map((classroom, index) => {
            return (
              <React.Fragment key={classroom.number}>
                {classroom.studentsCount ? (
                  <React.Fragment>
                    <tr>
                      <th
                        className={index >= 1 ? "straight" : ""}
                      >{`Classroom Number ${classroom.number}`}</th>
                    </tr>
                    {studentsInClassroom[index].map((element) => {
                      return (
                        <tr key={element.id}>
                          <td>{element.name}</td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ) : null}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SortTable;
