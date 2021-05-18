import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import HelmetTitle from "../../../components/base/Helmet";
import Spinner from "../../../components/base/Spinner";

const AuthLogin = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [load, SetLoad] = useState(false);
  const [show, setShow] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const [error, setError] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData({ ...data, [id]: value });
    if (data.password.length >= 6) {
      setError({
        email: false,
        password: false,
      });
    } else if (id === "password" && data.password.length < 6) {
      setError({
        email: false,
        password: true,
      });
    }
  };

  const handleSubmit = () => {
    SetLoad(true);
    if (data.email && data.password) {
      if (data.email.match(/@\w*.\w*/g)) {
        if (!error.password && !error.email) {
          axios
            .post(`${process.env.REACT_APP_URL_API}/users/login`, data)
            .then((result) => {
              SetLoad(false);
              dispatch({ type: "LOGIN_USER", payload: result.data.data });
              localStorage.setItem("token", result.data.data.token);
              Swal.fire("Success", "Login Success", "success");
              history.push("/home");
            })
            .catch((err) => {
              SetLoad(false);
              Swal.fire("Error", err.response.data.message, "error");
            });
        }
      } else {
        setError({ ...error, email: true });
      }
    } else {
      Swal.fire("Error", "Data cannot be null", "error");
    }
  };

  return (
    <div className="card-auth d-flex flex-column py-4">
      <HelmetTitle title="SayHello | Login" />
      <div className="wrapper-title d-flex py-4">
        <div className="title">
          <span>Login</span>
        </div>
      </div>
      <div className="sub-title mx-5 px-3 py-2">Hi, Welcome back!</div>
      <div className="wrapper-input d-flex flex-column mx-5 px-3 py-2 mt-4">
        <div className="title-input">Email</div>
        <div className="input">
          <input
            className={error.email ? "error" : "email"}
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
          />
        </div>
        {error.email && <div className="error-text">Invalid Email</div>}
      </div>
      <div className="wrapper-input d-flex flex-column mx-5 px-3 py-2">
        <div className="title-input">Password</div>
        <div className="input d-flex">
          <input
            className={error.password ? "error" : "password"}
            type={!show ? "password" : "text"}
            name="password"
            id="password"
            onChange={handleChange}
          />
          <div className="icon-eye" onClick={() => setShow(!show)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11.8 6C7.8 6 4.384 8.488 3 12C4.384 15.512 7.8 18 11.8 18C15.8 18 19.216 15.512 20.6 12C19.216 8.488 15.8 6 11.8 6ZM11.8 16C9.592 16 7.8 14.208 7.8 12C7.8 9.792 9.592 8 11.8 8C14.008 8 15.8 9.792 15.8 12C15.8 14.208 14.008 16 11.8 16ZM11.8 9.6C10.472 9.6 9.4 10.672 9.4 12C9.4 13.328 10.472 14.4 11.8 14.4C13.128 14.4 14.2 13.328 14.2 12C14.2 10.672 13.128 9.6 11.8 9.6Z"
                fill={show ? "#232323" : "#848484"}
              />
            </svg>
          </div>
        </div>
        {error.password && <div className="error-text">Be at least 6 characters long</div>}
      </div>
      <Link to="/auth/forgot">
        <div className="forgot-access my-2 mb-3">
          <span>Forgot password?</span>
        </div>
      </Link>
      <div className="btn-main mx-5 px-3 py-4">
        <button onClick={handleSubmit} disabled={load ? true : false}>
          {load ? <Spinner /> : "Login"}
        </button>
      </div>
      <div className="divider-area d-flex mx-5 px-1 py-3">
        <hr />
        <span className="px-4">Login With</span>
        <hr />
      </div>
      <div className="btn-main-2 mx-5 px-3 py-2 my-3">
        <img src="/assets/images/google.svg" alt="" />
        <span>Google</span>
      </div>
      <div className="register-access">
        <p>
          Don’t have an account?{" "}
          <Link to="/auth/register">
            <span>Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthLogin;
