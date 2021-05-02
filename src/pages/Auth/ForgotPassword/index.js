import React from "react";
import { Link } from "react-router-dom";
import HelmetTitle from "../../../components/base/Helmet";

const AuthForgotPassword = () => {
  return (
    <div className="card-auth d-flex flex-column py-4">
      <HelmetTitle title="SayHello | Forgot Password" />
      <div className="wrapper-title d-flex py-4">
        <Link to="/auth/login">
          <div className="btn-back">
            <img src="/assets/images/back.svg" alt="back" />
          </div>
        </Link>
        <div className="title">
          <span>Forgot Password</span>
        </div>
      </div>
      <div className="sub-title mx-5 px-3 py-2">You’ll get messages soon on your e-mail</div>
      <div className="wrapper-input d-flex flex-column mx-5 px-3 py-2 mt-4">
        <div className="title-input">Email</div>
        <div className="input">
          <input type="email" name="email" id="email" />
        </div>
      </div>
      <div className="btn-main mx-5 px-3 py-4">
        <button>Send</button>
      </div>
    </div>
  );
};

export default AuthForgotPassword;
