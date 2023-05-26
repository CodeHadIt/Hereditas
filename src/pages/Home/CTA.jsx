import React from 'react';
import { Link } from "react-router-dom";
import Button from '../../components/UI/Buttons/Button';
import styles from "./CTA.module.css";

const CTA = () => {
    return (
      <>
        <section className={styles.container}>
          <h2 className={styles.headline}>
            Get started as a <span className={styles.showcase}>Testator</span>{" "}
          </h2>
          <p className={styles.intro_paragraph}>
            Explore our protocol today by creating a gift for your friends,
            family and favourite DAO's. leverage the power of the blockchain
            today!{" "}
          </p>
          <Button>
            <Link to="dashboard/testator" className={styles.btn}>Launch App</Link>
          </Button>
        </section>

        <section className={`${styles.container} ${styles.second_container}`}>
          <h2 className={styles.headline}>
            Enter App as a <span className={styles.showcase}>Beneficiary</span>{" "}
          </h2>
          <p className={styles.intro_paragraph}>
            Lauch the protocol and see the assets you've been gifted
          </p>
          <Button>
            <Link to="dashboard/beneficiary">Enter App</Link>
          </Button>
        </section>
      </>
    );
}

export default CTA