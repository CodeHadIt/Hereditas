import React from 'react';
import styles from "./ClaimButton.module.css";

const ClaimButton = (props) => {
  return (
    <button
      type={props.type}
      className={styles.btn}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

export default ClaimButton