import React, { useState } from "react";
import ImageCol from "../../base/ImageCol";
import MyMapComponent from "../../base/Maps";
import { useSelector } from "react-redux";
import PhoneFormat from "../../../helper/phoneFormat";

const UserPanel = ({ fireEvent }) => {
  const [menu, setMenu] = useState("image");
  const state = useSelector((state) => state.chat.chat);

  const handleClick = (e) => {
    const { id } = e.target;
    setMenu(id);
  };

  return (
    <div className="col-3">
      <div className="header d-flex my-4 mx-4">
        <div className="icon-menu mt-3 me-4" onClick={() => fireEvent(false)}>
          <img src="/assets/images/back.svg" alt="" />
        </div>
        <div className="title my-2 py-1" style={{ fontSize: "22px" }}>
          @{state.username || "-"}
        </div>
      </div>
      <div className="profile-picture" style={{ margin: "0px 35%" }}>
        <img src={state.avatar} alt="" width="75px" height="75px" />
      </div>
      <div className="d-flex justify-content-between mx-4 pe-3 my-4">
        <div className="d-flex flex-column">
          <span className="name">{state.name}</span>
          <span>{state.socketId ? "Online" : "Offline"}</span>
        </div>
        <div className="icon">
          <img src="/assets/images/chat2.svg" alt="" />
        </div>
      </div>
      <div className="d-flex flex-column mx-4 pe-3 my-4">
        <span className="name">Phone Number</span>
        <span>{PhoneFormat(state.phone)}</span>
      </div>
      <hr className="mx-4 my-4" style={{ width: "82%" }} />
      <div className="menu d-flex justify-content-between mx-4 pe-3 my-4">
        <div
          id="location"
          className={menu === "location" ? "location py-2 active" : "location py-2"}
          onClick={handleClick}
        >
          Location
        </div>
        <div
          id="image"
          className={menu === "image" ? "image py-2 active" : "image py-2"}
          onClick={handleClick}
        >
          Images
        </div>
        <div
          id="document"
          className={menu === "document" ? "document py-2 active" : "document py-2"}
          onClick={handleClick}
        >
          Documents
        </div>
      </div>
      <div>
        {menu === "location" && <MyMapComponent isMarkerShown />}
        {menu === "image" && (
          <div className="row mx-4">
            <ImageCol src="/assets/images/1.png" />
            <ImageCol src="/assets/images/2.png" />
            <ImageCol src="/assets/images/3.png" />
            <ImageCol src="/assets/images/4.png" />
            <ImageCol src="/assets/images/5.png" />
            <ImageCol src="/assets/images/6.png" />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
