import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import HelmetTitle from "../../components/base/Helmet";

const Verify = () => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const token = location.search.split("=")[1];
    if (token) {
      axios
        .get(`${process.env.REACT_APP_URL_API}/users/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          history.push("/home");
          Swal.fire("Success", result.data.message, "success");
        })
        .catch((err) => {
          Swal.fire("Error", err.response.data.message, "error");
        });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <HelmetTitle title="SayHello | Verify Account" />
    </>
  );
};

export default Verify;
