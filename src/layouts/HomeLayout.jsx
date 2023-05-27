import React from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGifts } from "@fortawesome/free-solid-svg-icons";

import Button from "../components/UI/Buttons/Button";
import Footer from "../components/Footer/Footer";
import styles from "./HomeLayout.module.css";

const HomeLayout = () => {

  const handleAlert = () => {
    alert("Please use app in a browser with an Ethereum wallet installed");
  };

  return (
    <div className={styles.home_layout}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <FontAwesomeIcon icon={faGifts} className={styles.logo} />
          <NavLink to="/" className={styles.protocol_name}>
            Hereditas
          </NavLink>
        </div>
        <div className={styles.links}>
          <HashLink smooth to="#how" className={styles.how}>
            How It Works
          </HashLink>
          <HashLink smooth to="#testator" className={styles.how}>
            As as Testator
          </HashLink>
          <HashLink smooth to="#beneficiary" className={styles.how}>
            As as Beneficiary
          </HashLink>
        </div>
        <Button>
          {window.ethereum ? (
            <Link to="dashboard/testator" className={styles.btn}>
              Lauch App
            </Link>
          ) : (
            <Link to="#" onClick={handleAlert}>
              Lauch App
            </Link>
          )}
        </Button>
      </div>

      <Outlet />
      <Footer />
    </div>
  );
};

export default HomeLayout;
