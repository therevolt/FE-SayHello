import React, { useState } from "react";
import Modal from "react-modal";
import { useMediaQuery } from "react-responsive";
import Profile from "../../base/Profile";
import Home from "../../base/Home";
import { useDispatch } from "react-redux";

const customStyles = {
  content: {
    top: "30%",
    left: "15%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const SidePanel = ({ fireEvent }) => {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [modalIsOpen, setIsOpen] = useState(false);
  const responsivePage = useMediaQuery({ query: "(max-width: 800px)" });
  const dispatch = useDispatch();

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div
      className={responsivePage ? "col-3 side-panel-mobile" : "col-3 side-panel"}
      style={responsivePage ? { display: fireEvent ? "block" : "none" } : { marginLeft: "15px" }}
    >
      {/* Home */}
      {selectedMenu === "home" && <Home fireEvent={setIsOpen} />}
      {/* Setting */}
      {selectedMenu === "setting" && <Profile fireEvent={setSelectedMenu} />}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        bodyOpenClassName="modal-react"
      >
        <div
          className="menu d-flex mb-3"
          onClick={() => {
            setSelectedMenu("setting");
            closeModal();
          }}
        >
          <div className="icon me-3">
            <img src="/assets/images/Settings.svg" alt="" width="24" height="24" />
          </div>
          <span>Settings</span>
        </div>
        <div className="menu d-flex mb-3">
          <div className="icon me-3">
            <img src="/assets/images/Contacts.svg" alt="" width="24" height="24" />
          </div>
          <span>Contacts</span>
        </div>
        <div className="menu d-flex mb-3">
          <div className="icon me-3">
            <img src="/assets/images/Vector.svg" alt="" width="24" height="24" />
          </div>
          <span>Calls</span>
        </div>
        <div className="menu d-flex mb-3">
          <div className="icon me-3">
            <img src="/assets/images/bookmark.svg" alt="" width="24" height="24" />
          </div>
          <span>Save Messages</span>
        </div>
        <div className="menu d-flex mb-3">
          <div className="icon me-3">
            <img src="/assets/images/Invite friends.svg" alt="" width="24" height="24" />
          </div>
          <span>Invite Friends</span>
        </div>
        <div className="menu d-flex mb-3">
          <div className="icon me-3">
            <img src="/assets/images/FAQ.svg" alt="" width="24" height="24" />
          </div>
          <span>FAQ</span>
        </div>
        <div
          className="menu d-flex mb-3"
          onClick={() => {
            localStorage.removeItem("token");
            dispatch({ type: "LOGIN_USER", payload: "" });
            window.location.replace("/auth/login");
          }}
        >
          <div className="icon me-3">
            <img src="/assets/images/exit.svg" alt="" width="24" height="24" />
          </div>
          <span>Logout</span>
        </div>
      </Modal>
    </div>
  );
};

export default SidePanel;
