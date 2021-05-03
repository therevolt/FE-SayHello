import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import styles from "./splash.module.css";

const SplashScreen = () => {
  const [tick, setTick] = useState(100);
  let history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      if (!localStorage.getItem("token")) {
        history.push("/auth/login");
      } else {
        history.push("/home");
      }
    }, 2000);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setTick(tick + 100);
    }, 1000);
  }, [tick]);

  return (
    <div className={styles["splash-screen"]}>
      <img
        src="/assets/images/loading.svg"
        style={{ transform: `rotate(${tick}deg)` }}
        alt="loading"
      />
    </div>
  );
};

export default SplashScreen;
