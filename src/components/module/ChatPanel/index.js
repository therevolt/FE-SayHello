import React, { useRef } from "react";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosApiInstance from "../../../helper/axiosInstance";
import Modal from "react-modal";

const ChatPanel = ({ fireEvent, fireEvent2 }) => {
  const [socketState, setSocketState] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [defaultMessages, setDefaultMessages] = useState([]);
  const responsivePage = useMediaQuery({ query: "(max-width: 800px)" });
  const [sender, setSender] = useState(null);
  const [bottom, setBottom] = useState(false);
  const [target, setTarget] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [numberPages, setNumberPages] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const state = useSelector((state) => state.chat.chat);
  const user = useSelector((state) => state.user.user);
  const bottomRef = useRef();
  const inputRef = useRef();

  const customStyles = {
    content: {
      top: "25%",
      left: responsivePage ? "0" : "87%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      zIndex: "2",
      width: "235px",
    },
  };

  function closeModal() {
    setIsOpen(false);
  }

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setBottom(true);
  };

  const socketSetup = () => {
    const receiver = state ? state.userId : "";
    const socket = io(process.env.REACT_APP_SOCKET_URL, {
      query: {
        sender: user.userId || "",
        name: user.name || "",
        receiver: receiver,
      },
      secure: true,
    });
    setSocketState(socket);
  };

  useEffect(() => {
    socketSetup();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (state) {
      setBottom(false);
      axiosApiInstance.get(`${process.env.REACT_APP_URL_API}/messages/read?user=${state.userId}`);
      dispatch({ type: "SET_LAST_MSG", payload: Math.floor(Math.random() * 101) });
      setSender(state.id);
      axiosApiInstance
        .post(`${process.env.REACT_APP_URL_API}/messages/get?page=0&size=10`, { to: state.userId })
        .then((result) => {
          if (result.data.data.message.length > 0) {
            setTarget(result.data.data.message[result.data.data.message.length - 1].id);
            setMessages(result.data.data.message);
            setDefaultMessages(result.data.data.message);
            if (result.data.data.totalPages > 0) {
              setNumberPages(
                Array.from(Array(result.data.data.totalPages - 1), (_, index) => index + 1)
              );
            } else {
              setNumberPages([]);
            }
            setBottom(false);
          }
        })
        .catch((err) => {
          Swal.fire("Error", err.response.data.message, "error");
          localStorage.removeItem("token");
          dispatch({ type: "LOGIN_USER", payload: "" });
          history.push("/auth/login");
        });
      fireEvent(false);
    } else {
      fireEvent(true);
    } // eslint-disable-next-line
  }, [state]);

  const scrollOnTop = async () => {
    if (document.getElementById("chat").scrollTop === 0) {
      if (numberPages.length > 0) {
        const currentPage = numberPages.shift();
        await axiosApiInstance
          .post(`${process.env.REACT_APP_URL_API}/messages/get?page=${currentPage}&size=10`, {
            to: state.userId,
          })
          .then((result) => {
            setMessages([...result.data.data.message, ...messages]);
            setDefaultMessages([...result.data.data.message, ...messages]);
            setNumberPages(numberPages);
          })
          .catch((err) => {
            Swal.fire("Error", err.response.data.message, "error");
            localStorage.removeItem("token");
            dispatch({ type: "LOGIN_USER", payload: "" });
            history.push("/auth/login");
          });
        if (target) {
          document.getElementById("chat").scrollTo(0, messages.length * 15);
        }
      }
    }
  };

  useEffect(() => {
    if (socketState) {
      socketState.once("recMsg", (msg) => {
        if (msg.to === user.userId) {
          setMessages([...messages, msg]);
          setDefaultMessages([...messages, msg]);
          setBottom(false);
        }
      });
    } // eslint-disable-next-line
  }, [messages]);

  useEffect(() => {
    if (!bottom && messages.length > 0) {
      scrollToBottom();
    }
  }, [bottom, messages]);

  useEffect(() => {
    if (socketState) {
      socketState.on("notif", (data) => {
        dispatch({ type: "SET_LAST_MSG", payload: Math.floor(Math.random() * 101) });
        if (state) {
          if (data.from !== state.userId) {
            setSender(data.from);
            toast(`New Chat From ${data.name}`, {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else {
            // axiosApiInstance.get(
            //   `${process.env.REACT_APP_URL_API}/messages/read?user=${state.userId}`
            // );
            dispatch({ type: "SET_LAST_MSG", payload: Math.floor(Math.random() * 101) });
          }
        } else {
          setSender(data.from);
          toast(`New Chat From ${data.name}`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
      if (state) {
        socketState.on("online", (data) => {
          axiosApiInstance
            .get(`${process.env.REACT_APP_URL_API}/users/list`)
            .then((result) => {
              dispatch({ type: "SET_LAST_MSG", payload: `${Math.floor(Math.random() * 101)}` });
              if (state.userId === data.userId) {
                dispatch({
                  type: "SET_CHAT",
                  payload: result.data.data.filter((item) => item.userId === state.userId)[0],
                });
              }
            })
            .catch(() => {
              // Do Nothing
            });
        });
      }
    } // eslint-disable-next-line
  }, [socketState]);

  const handleClick = async () => {
    await axiosApiInstance
      .get(`${process.env.REACT_APP_URL_API}/messages/read?user=${state.userId}`)
      .then(() => dispatch({ type: "SET_LAST_MSG", payload: `${Math.floor(Math.random() * 101)}` }))
      .catch(() =>
        dispatch({ type: "SET_LAST_MSG", payload: `${Math.floor(Math.random() * 101)}` })
      );
    await axiosApiInstance.post(`${process.env.REACT_APP_URL_API}/messages`, {
      to: state.userId,
      messageBody: message,
    });
    setMessages([
      ...messages,
      {
        messageBody: message,
        to: state.userId,
        from: user.userId,
        time: `${new Date().toDateString().split(" ")[0]}, ${
          new Date().getHours() < 10 ? `0${new Date().getHours()}` : new Date().getHours()
        }:${
          new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : new Date().getMinutes()
        }`,
      },
    ]);
    setDefaultMessages([
      ...messages,
      { messageBody: message, to: state.userId, from: user.userId },
    ]);
    socketState.emit("sendMsg", {
      message,
      to: state.userId,
      from: user.userId,
    });
    setBottom(false);
    setMessage("");
  };

  const onChangeInput = (e) => {
    const { value } = e.target;
    setMessage(value);
  };

  const handleSearchMessage = (e) => {
    const { value } = e.target;
    if (value !== "") {
      setMessages(
        defaultMessages.filter((item) => item.messageBody.toLowerCase().match(value.toLowerCase()))
      );
    } else {
      setMessages(defaultMessages);
    }
  };

  return (
    <div className="col position-relative" style={{ padding: 0, paddingRight: "13px" }}>
      {state && sender ? (
        state.userId && sender !== state.userId && <ToastContainer />
      ) : (
        <ToastContainer />
      )}
      {!state ? (
        <>
          <div className="null-chat position-absolute top-50">
            Please select a chat to start messaging
          </div>
        </>
      ) : (
        <>
          <div className="header-chat d-flex justify-content-between px-5 py-3">
            <div className="d-flex">
              <div className="back-btn me-4 my-3" onClick={() => fireEvent(true)}>
                <img src="/assets/images/back.svg" alt="" />
              </div>
              <div
                className="picture-chat"
                onClick={() => {
                  fireEvent2[1](!fireEvent2[0]);
                }}
              >
                <img src={state.avatar} alt="" height="64" width="64" />
              </div>
              <div
                className="name-receiver d-flex flex-column mx-2"
                onClick={() => {
                  fireEvent2[1](!fireEvent2[0]);
                }}
              >
                <div className="name">{state.name}</div>
                <div className="status my-1">{state.socketId ? "Online" : "Offline"}</div>
              </div>
            </div>
            <div className="d-flex">
              <input
                type="text"
                name="search"
                id="search"
                style={{
                  background: "#c3c3c3",
                  height: "30px",
                  marginTop: "15px",
                  paddingLeft: "5px",
                  borderRadius: "5px",
                }}
                placeholder="Search Here"
                onChange={handleSearchMessage}
                hidden={selectedMenu === "search" ? false : true}
              />
              <div className="icon-profile my-3 ms-4" onClick={() => setIsOpen(true)}>
                <img src="/assets/images/profile.svg" alt="" />
              </div>
            </div>
          </div>
          <div
            id="chat"
            className="body-chat"
            onClick={() => {
              fireEvent(false);
              fireEvent2[1](false);
            }}
            onScroll={scrollOnTop}
          >
            <ul>
              {messages.length > 0 && // eslint-disable-next-line
                messages.map((item, i) => {
                  if (item.to === user.userId && item.from === state.userId) {
                    return (
                      <li
                        id={item.id}
                        className="chat-receiver d-flex text-start mt-2 mx-2 position-relative d-flex"
                        key={i}
                      >
                        <img src={state.avatar} alt="" width="54" height="54" />
                        <div className="mx-2" style={{ maxWidth: "350px" }}>
                          {item.messageBody}
                        </div>
                        <div className="time-msg">{item.time}</div>
                      </li>
                    );
                  } else if (item.to === state.userId && item.from === user.userId) {
                    return (
                      <li
                        id={item.id}
                        className="chat-sender d-flex justify-content-end text-end mt-2 mx-2 position-relative"
                        key={i}
                      >
                        <div className="time-msg">{item.time}</div>
                        <div className="icon-msg in-chat">
                          {item.isRead ? (
                            <img src="/assets/images/read.svg" alt="" />
                          ) : (
                            <img src="/assets/images/send2.svg" alt="" />
                          )}
                        </div>
                        <div className="mx-2" style={{ maxWidth: "350px" }}>
                          {item.messageBody}
                        </div>
                        <img src={user.avatar} alt="" width="54" height="54" />
                      </li>
                    );
                  }
                })}
              <li ref={bottomRef} className="list-bottom"></li>
            </ul>
          </div>
          <div className="footer-chat d-flex justify-content-between position-absolute bottom-0">
            <div className="input mx-5 px-3 my-3 position-relative">
              <input
                id="message"
                onChange={onChangeInput}
                onKeyPress={(key) => key.code === "Enter" && handleClick()}
                value={message}
                autoComplete="off"
              />
              <div className="action-chat d-flex position-absolute end-0 top-0 my-3">
                <input type="file" name="attach" id="attach" ref={inputRef} hidden />
                <div className="menu icon-plus mx-2" onClick={() => inputRef.current.click()}>
                  <img src="/assets/images/plus_blue.svg" alt="" />
                </div>
                <div className="menu icon-emot mx-2">
                  <img src="/assets/images/emot_blue.svg" alt="" />
                </div>
                <div className="menu icon-cam mx-2 me-4">
                  <img src="/assets/images/cam_blue.svg" alt="" />
                </div>
              </div>
            </div>
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            bodyOpenClassName="modal-react"
          >
            <div className="menu d-flex mb-4">
              <div className="icon me-3">
                <img src="/assets/images/Vector.svg" alt="" width="24" height="24" />
              </div>
              <span>Calls</span>
            </div>
            <div className="menu d-flex my-4">
              <div className="icon me-3">
                <img src="/assets/images/trash.svg" alt="" width="24" height="24" />
              </div>
              <span>Delete chat history</span>
            </div>
            <div className="menu d-flex my-4">
              <div className="icon me-3">
                <img src="/assets/images/Union-white.svg" alt="" width="24" height="24" />
              </div>
              <span>Mute notification</span>
            </div>
            <div
              className="menu d-flex mt-4"
              onClick={() => {
                if (selectedMenu === "search") {
                  setSelectedMenu("none");
                } else {
                  setSelectedMenu("search");
                }
                closeModal();
              }}
            >
              <div className="icon me-3">
                <img src="/assets/images/Search-white.svg" alt="" width="24" height="24" />
              </div>
              <span>Search</span>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ChatPanel;
