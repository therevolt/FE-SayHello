import React, { useState, useRef } from "react";
import FormData from "form-data";
import { useSelector, useDispatch } from "react-redux";
import axiosApiInstance from "../../../helper/axiosInstance";
import Swal from "sweetalert2";
import PhoneFormat from "../../../helper/phoneFormat";
import Spinner from "../Spinner";

const Profile = ({ fireEvent }) => {
  const state = useSelector((state) => state.user.user);
  const [data, setData] = useState({
    phone: state.phone,
    username: state.username,
    bio: state.bio,
    name: state.name,
  });
  const [load, setLoad] = useState(false);
  const avatar = useRef();
  const form = new FormData();
  const dispatch = useDispatch();
  const [editMenu, setEditMenu] = useState({
    phone: false,
    username: false,
    bio: false,
  });
  const handleAvatar = () => {
    avatar.current.click();
  };

  const handleChange = async (e) => {
    const { id, value } = e.target;
    if (id === "avatar") {
      setLoad(true);
      let file = e.target.files[0];
      form.append("avatar", file, file.name);
      await axiosApiInstance
        .put(`${process.env.REACT_APP_URL_API}/users`, form)
        .then((result) => {
          setLoad(false);
          dispatch({
            type: "LOGIN_USER",
            payload: result.data.data,
          });
          Swal.fire("Success", result.data.message, "success");
        })
        .catch((err) => {
          setLoad(false);
          Swal.fire("Error", err.response.data.message, "error");
        });
    } else {
      setData({ ...data, [id]: value });
    }
  };

  const handleSubmit = () => {
    axiosApiInstance
      .put(`${process.env.REACT_APP_URL_API}/users`, data)
      .then((result) => {
        dispatch({
          type: "LOGIN_USER",
          payload: result.data.data,
        });
        Swal.fire("Success", result.data.message, "success");
      })
      .catch((err) => {
        Swal.fire("Error", err.response.data.message, "error");
      });
  };

  const handleEditMenu = (e) => {
    const { id } = e.target;
    setEditMenu({ ...editMenu, [id]: !editMenu[id] });
  };
  return (
    <>
      <div className="header d-flex my-4 mx-4">
        <div className="icon-menu mt-3 me-4" onClick={() => fireEvent("home")}>
          <img src="/assets/images/back.svg" alt="" />
        </div>
        <div className="title my-2">@{data.username || "-"}</div>
      </div>
      <div className="profile-info mx-2">
        <div className="d-flex">
          <input
            type="file"
            name="avatar"
            id="avatar"
            ref={avatar}
            hidden
            onChange={handleChange}
          />
          <div className="profile-picture ms-3" onClick={() => handleAvatar()}>
            {load ? (
              <Spinner className="spinner-avatar" />
            ) : (
              <img src={state.avatar} alt="" width="82" height="82" />
            )}
          </div>
          <div className="d-flex flex-column my-2 mx-2">
            <div className="name text-black">
              <input
                type="text"
                name="name"
                id="name"
                value={data.name}
                onChange={handleChange}
                onClick={handleEditMenu}
                onBlur={handleEditMenu}
              />
            </div>
            <div className="phone tap">{PhoneFormat(state.phone)}</div>
          </div>
        </div>
      </div>
      <div className="detail-profile">
        <div className="account mx-4 my-4">
          <div className="title my-2">Account</div>
          <div className="detail-account">
            <div className="text-black">
              <input
                type="text"
                name="phone"
                id="phone"
                value={editMenu.phone ? data.phone : PhoneFormat(data.phone)}
                disabled={editMenu.phone ? false : true}
                onBlur={handleEditMenu}
                onChange={handleChange}
              />
            </div>
            <div className="tap my-1" onClick={handleEditMenu} id="phone">
              Tap to change phone number
            </div>
          </div>
        </div>
        <hr />
        <div className="account mx-4 my-4">
          <div className="detail-account">
            <div className="text-black">
              @
              <input
                type="text"
                name="username"
                id="username"
                value={editMenu.username ? data.username : `${data.username || "-"}`}
                disabled={editMenu.username ? false : true}
                autoFocus
                onBlur={handleEditMenu}
                onChange={handleChange}
              />
            </div>
            <div className="tap my-1" onClick={handleEditMenu} id="username">
              Username
            </div>
          </div>
        </div>
        <hr />
        <div className="account mx-4 my-4">
          <div className="detail-account">
            <div className="text-black">
              <input
                type="text"
                name="bio"
                id="bio"
                value={data.bio}
                disabled={editMenu.bio ? false : true}
                autoFocus
                onBlur={handleEditMenu}
                onChange={handleChange}
              />
            </div>
            <div className="tap my-1" onClick={handleEditMenu} id="bio">
              Bio
            </div>
          </div>
        </div>
        <div className="position-relative py-2 mx-3">
          <button className="btn-main-2 update position-absolute end-0" onClick={handleSubmit}>
            Update Info
          </button>
        </div>
      </div>
      <div className="settings mx-4 my-4">
        <div className="title my-2">Settings</div>
        <div className="menu d-flex my-2">
          <div className="icon me-3">
            <img src="/assets/images/Union.svg" alt="" width="22" height="20" />
          </div>
          <div className="text-setting my-1">Notification and Sounds</div>
        </div>
        <div className="menu d-flex my-2">
          <div className="icon me-3">
            <img src="/assets/images/lock-black.svg" alt="" width="22" height="20" />
          </div>
          <div className="text-setting my-1">Privaty and Security</div>
        </div>
        <div className="menu d-flex my-2">
          <div className="icon me-3">
            <img src="/assets/images/data.svg" alt="" width="22" height="20" />
          </div>
          <div className="text-setting my-1">Data and Stronge</div>
        </div>
        <div className="menu d-flex my-2">
          <div className="icon me-3">
            <img src="/assets/images/Chat.svg" alt="" width="22" height="20" />
          </div>
          <div className="text-setting my-1">Chat settings</div>
        </div>
        <div className="menu d-flex my-2">
          <div className="icon me-3">
            <img src="/assets/images/Device.svg" alt="" width="22" height="20" />
          </div>
          <div className="text-setting my-1">Devices</div>
        </div>
      </div>
    </>
  );
};

export default Profile;
