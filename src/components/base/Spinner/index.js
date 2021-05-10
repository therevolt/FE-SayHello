import React from "react";

const Spinner = (props) => {
  return (
    <div className={["spinner-border text-info", props.className].join(" ")} role="status">
      <span className="sr-only"></span>
    </div>
  );
};

export default Spinner;
