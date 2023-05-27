import React, { useEffect} from "react";
import { NavLink } from "react-router-dom";
import Button from "../../components/UI/Buttons/Button";

import styles from "./NotFound.module.css"


const NotFound = () => {

  return (
    <div className={styles.notfound_container}>
      <div className={styles.fourohfour}>404</div>
      <h5>Oops! Page not found</h5>
      <p>There is no active page on the URL you entered.</p>
      <Button>
        <NavLink to="/" className={styles.btn}>
          Return to HomePage
        </NavLink>
      </Button>
    </div>
  );
};

export default NotFound;
