import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGifts } from "@fortawesome/free-solid-svg-icons";

import ConnectBtn from "../components/UI/Buttons/ConnectButton";
import styles from "./DashboardLayout.module.css";

const DashboardLayout = () => {

  return (
    <>
      <section className={styles.container}>
        <div className={styles.brand}>
          <FontAwesomeIcon icon={faGifts} className={styles.logo} />
          <NavLink to="/" className={styles.protocol_name}>
            Hereditas
          </NavLink>
        </div>
        <ConnectBtn />
      </section>

      <Outlet />
    </>
  );
};

export default DashboardLayout;
