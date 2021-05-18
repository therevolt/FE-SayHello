import React from "react";

const ImageCol = (props) => {
  return (
    <div className="col-4 my-2 profile-picture">
      <img src={props.src} alt="" width="70px" height="75px" style={{ borderRadius: "10px" }} />
    </div>
  );
};

export default ImageCol;
