import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosApiInstance from "../../../helper/axiosInstance";
import Input from "../Input";

const Home = ({ fireEvent }) => {
  const state = useSelector((state) => state.user.user);
  const lastMsg = useSelector((state) => state.chat.lastMessage);
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState("all");
  const [list, setList] = useState([]);
  const [defaultList, setDefaultList] = useState([]);
  const [slide, setSlide] = useState(() => false);
  const dispatch = useDispatch();

  useEffect(() => {
    axiosApiInstance
      .get(`${process.env.REACT_APP_URL_API}/users/list`)
      .then((result) => {
        setList(result.data.data);
        setDefaultList(result.data.data);
      })
      .catch(() => {
        // Do Nothing
      });
  }, [lastMsg]);

  function openModal() {
    fireEvent(true);
  }

  const handleClickMenu = () => {
    setMenu(!menu);
  };

  const handleFilter = (e) => {
    const { id } = e.target;
    if (id === "unread") {
      setList(defaultList.filter((item) => item.countUnread > 0));
    } else if (id === "all") {
      setList(defaultList);
    }
    setFilter(id);
  };

  const handleOpenChat = (value) => {
    dispatch({ type: "SET_CHAT", payload: value });
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    if (value !== "") {
      setList(defaultList.filter((item) => item.name.toLowerCase().match(value.toLowerCase())));
    } else {
      setList(defaultList);
    }
  };

  return (
    <>
      <div className="header d-flex justify-content-between my-4 mx-4">
        {!menu ? (
          <div className="title my-2">SayHello Apps</div>
        ) : (
          <div className="menu-window d-flex justify-content-between">
            <div className="new-channel mx-4 my-3">
              <img src="/assets/images/new_group.svg" alt="" />
            </div>
            <div className="new-channel mx-4 my-3">
              <img src="/assets/images/secret_chat.svg" alt="" />
            </div>
            <div className="new-channel mx-4 my-3">
              <img src="/assets/images/new_channel.svg" alt="" />
            </div>
          </div>
        )}
        <div className="icon-menu mt-2" onClick={openModal}>
          <img src="/assets/images/Menu.svg" alt="" />
        </div>
      </div>
      <div className="profile-mini d-flex flex-column align-items-center my-4">
        <div className="profile-picture my-2">
          <img src={state.avatar || "/assets/images/Radu.jpg"} alt="" width="82" height="82" />
        </div>
        <div className="name mt-3">{state.name}</div>
        <div className="profile-username">@{state.username || "-"}</div>
      </div>
      <div className="wrapper-search d-flex justify-content-between my-4 mx-4">
        <div className="input d-flex position-relative">
          <div className="icon-search position-absolute">
            <img src="/assets/images/Search.svg" alt="" />
          </div>
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Search Contact Here"
            onChange={handleSearch}
          />
        </div>
        <div className="plus-icon" onClick={handleClickMenu}>
          <img src="/assets/images/plus.svg" alt="" />
        </div>
      </div>
      <div className="menu d-flex justify-content-between mx-4">
        <div
          id="all"
          className={filter === "all" ? "all my-2 py-2 active" : "all py-2 my-2"}
          onClick={handleFilter}
        >
          All
        </div>
        <div
          id="important"
          className={filter === "important" ? "important py-2 my-2 active" : "important py-2 my-2"}
          onClick={handleFilter}
        >
          Important
        </div>
        <div
          id="unread"
          className={filter === "unread" ? "unread my-2 py-2 active" : "unread py-2 my-2"}
          onClick={handleFilter}
        >
          Unread
        </div>
      </div>
      <div className="content-chat">
        {list.length > 0 &&
          list.map((item, i) => {
            return (
              <div className="card-chat" style={{ position: "relative", height: "90px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: "100%",
                    background: "#7E98DF",
                    padding: "1em",
                    color: "black",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>-</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <img
                        src="/assets/images/bookmark.svg"
                        alt=""
                        style={{ borderRadius: "0px" }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      axiosApiInstance
                        .get(`${process.env.REACT_APP_URL_API}/messages/read?user=${item.userId}`)
                        .then(() => {
                          setSlide(false);
                          dispatch({
                            type: "SET_LAST_MSG",
                            payload: Math.floor(Math.random() * 101),
                          });
                        });
                    }}
                  >
                    <div>
                      <img src="/assets/images/send2.svg" alt="" style={{ borderRadius: "0px" }} />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      axiosApiInstance
                        .delete(`${process.env.REACT_APP_URL_API}/messages?user=${item.userId}`)
                        .then(() => {
                          setSlide(false);
                          dispatch({
                            type: "SET_LAST_MSG",
                            payload: Math.floor(Math.random() * 101),
                          });
                        });
                    }}
                  >
                    <div>
                      <img src="/assets/images/trash.svg" alt="" style={{ borderRadius: "0px" }} />
                    </div>
                  </div>
                </div>
                <div
                  draggable
                  onDragEnd={() => (slide === i ? setSlide(false) : setSlide(i))}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: slide === i ? "25%" : "100%",
                    background: "white",
                    padding: "1em",
                    color: "black",
                    flex: 1,
                    position: "absolute",
                    top: 0,
                    transition: "width 0.5s",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  id="chat1"
                  onClick={() => handleOpenChat(item)}
                >
                  {slide === i ? (
                    <div className="status-card d-flex flex-column px-3">
                      <div className="time my-2">{item.lastTime}</div>
                      {item.countUnread > 0 ? (
                        <div className="unread">{item.countUnread}</div>
                      ) : (
                        <div className="icon-msg">
                          <img src="/assets/images/read.svg" alt="" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="d-flex">
                        <div className="position-relative">
                          {item.socketId && (
                            <div className="online-dot position-absolute end-0 bottom-0">
                              <span class="tooltiptext">Online</span>
                              <img src="/assets/images/rec.svg" alt="dot" width="20" height="20" />
                            </div>
                          )}
                          <img src={item.avatar} alt="" height="62" width="64" />
                        </div>
                        <div className="detail-card d-flex flex-column mx-2">
                          <div className="name my-1">{item.name}</div>
                          <div className="text-chat">
                            {item.countUnread > 0 ? <b>{item.lastMessage}</b> : item.lastMessage}{" "}
                          </div>
                        </div>
                      </div>
                      <div className="status-card d-flex flex-column">
                        <div className="time my-2">
                          {item.lastMessage === "" ? "" : item.lastTime}
                        </div>
                        {item.lastMessage === "" ? (
                          ""
                        ) : item.countUnread > 0 ? (
                          <div className="unread">{item.countUnread}</div>
                        ) : (
                          <div className="icon-msg">
                            <img src="/assets/images/read.svg" alt="" />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Home;
