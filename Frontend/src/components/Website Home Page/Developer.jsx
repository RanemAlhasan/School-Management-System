import React from "react";

function Developer({ person }) {
  let { name, picName, rule, technology, email, facebook } = person;
  return (
    <div className="developer">
      <img
        src={require(`../../images/${picName}`).default}
        alt={`${name} pic`}
      />
      <h2>{name}</h2>
      <p>{rule}</p>
      <p>" {technology} "</p>
      <a href={`mailto:${email}`}>
        <i className="las la-envelope" />{" "}
      </a>
      <a href={`${facebook}`}>
        <i className="lab la-facebook" />
      </a>
    </div>
  );
}

export default Developer;
