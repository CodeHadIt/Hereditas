import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Buttons/Button';
import styles from "./Headline.module.css";

const Headline = () => {
    return (
      <section className={styles.container}>
        <h1 className={styles.headline}>
          Draft Your <span className={styles.showcase}>Will</span> on the{" "}
          <span className={styles.showcase}>Blockchain</span>{" "}
        </h1>
        <p className={styles.intro_paragraph}>
          Gift your digital assets to family, friends, and your favourite
          blockchain DAOs at a time of your choosing!
        </p>
        <Button>
          <Link to="dashboard/testator">
            Get Started
          </Link>
        </Button>
      </section>
    );
}

export default Headline;