import React, { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import Layout from "../../components/module/Layout";

const RoomChat = () => {
  const [show, setShow] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history.push("/auth/login");
    } else {
      setShow(true);
    } // eslint-disable-next-line
  }, []);

  return <Layout show={show} />;
};

export default RoomChat;
