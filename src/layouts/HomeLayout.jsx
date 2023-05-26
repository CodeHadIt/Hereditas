import React from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGifts } from "@fortawesome/free-solid-svg-icons";

import Button from "../components/UI/Buttons/Button";
import styles from "./HomeLayout.module.css";

const HomeLayout = () => {

  return (
    <>
      <section className={styles.container}>
        <div className={styles.brand}>
          <FontAwesomeIcon icon={faGifts} className={styles.logo} />
          <NavLink to="/" className={styles.protocol_name}>
            Hereditas
          </NavLink>
        </div>
        <div className={styles.links}>
          <NavLink to="about" className={styles.how}>
            How It Works
          </NavLink>
          <NavLink to="dashboard/testator" className={styles.how}>
            As as Testator
          </NavLink>
          <NavLink to="dashboard/beneficiary" className={styles.how}>
            As as Beneficiary
          </NavLink>
        </div>
        <Button>
          <Link to="dashboard/testator" className={styles.btn}>Lauch App</Link>
        </Button>
      </section>

      <Outlet/>
    </>
  );
};

export default HomeLayout;
