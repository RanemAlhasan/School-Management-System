export function Profile(props) {
  let teacher = props.teacher;
  return (
    <div>
      <table className="profile">
        <thead>
          <tr>
            <th colSpan="3">
              <i className="far fa-clipboard" />
              General Information
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{teacher.name}</td>
          </tr>
          <tr>
            <th colSpan="">Date of Birth</th>
            <td colSpan="">{teacher.birthDate}</td>
          </tr>
          <tr>
            <th colSpan="1">Certification</th>
            <td colSpan="2">{teacher.certification}</td>
          </tr>
          <tr>
            <th colSpan="1">Residential Address</th>
            <td colSpan="2">{teacher.residentialAddress}</td>
          </tr>
          <tr>
            <th colSpan="1">Email</th>
            <td colSpan="2">{teacher.email}</td>
          </tr>
          <tr>
            <th colSpan="1">Phone Number</th>
            <td colSpan="2">{teacher.phoneNumber}</td>
          </tr>
          <tr>
            <th colSpan="1">Secret id</th>
            <td colSpan="2">{teacher.id}</td>
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
