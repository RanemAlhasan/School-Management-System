export function Profile(props) {
  let student = props.student;
  return (
    <div>
      <table className="profile">
        <thead>
          <tr>
            <th colSpan="3">
              <i className="las la-clipboard" />
              General Information
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{student.name}</td>
          </tr>
          <tr>
            <th colSpan="">Date of Birth</th>
            <td colSpan="">{student.birthDate}</td>
          </tr>
          <tr>
            <th colSpan="1">Father Name</th>
            <td colSpan="2">{student.fatherName}</td>
          </tr>
          <tr>
            <th colSpan="1">Mother Name</th>
            <td colSpan="2">{student.motherName}</td>
          </tr>

          <tr>
            <th colSpan="1">Email</th>
            <td colSpan="2">{student.email}</td>
          </tr>
          <tr>
            <th colSpan="1">Phone Number</th>
            <td colSpan="2">{student.phoneNumber}</td>
          </tr>
          <tr>
            <th colSpan="1">Secret id</th>
            <td colSpan="2">{student.id}</td>
          </tr>
          <tr>
            <th colSpan="2" style={{ color: " #e74c3c" }}>
              Don't share this id unless you are going to use it to register in
              another school
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Profile;
