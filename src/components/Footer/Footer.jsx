import React from 'react';

import styles from "./Footer.module.css"

const Footer = () => {
  return (
    <footer>
      <div className={styles.footer_container}>
        <p>Copyright Hereditas © All Rights Reserved</p>
        <p>
          Made by{" "}
          <a href="https://codehadit.dev" target="_blank">
            Code Hadit
          </a>{" "}
        </p>
      </div>
    </footer>
  );
}

export default Footer