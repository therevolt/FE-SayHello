import React from "react";

const Input = (props) => {
  return <input className={props.className} onChange={props.onChange} {...props} />;
};

export default Input;
