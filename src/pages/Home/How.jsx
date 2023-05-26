import React from 'react';
import Card from '../../components/UI/Card/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faUserPlus, faCalendarPlus, faHandHoldingHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "./How.module.css";

const How = () => {
    return (
      <section className={styles.container}>
        <h2 className={styles.headline}>How It Works </h2>
        <p className={styles.intro_paragraph}>
          Hereditas operates on a simple yet sophisticated mechanism. You choose
          the assets you want to gift and pick designated beneficiaries. You
          then set a specific date when these gifts can be claimed by the named
          beneficiaries. You're at liberty to cancel the gifts anytime before
          they're claimed!{" "}
        </p>
        <div className={styles.card_container}>
          <Card>
            <div className={styles.icon_container}>
              <FontAwesomeIcon icon={faCircleCheck} className={styles.icon} />
            </div>
            <h3 className={styles.card_heading}>Pick Assets</h3>
            <p className={styles.card_paragraph}>
              Select the assests you want to gift to a beneficiary. The Assets
              can be an ERC20 token or and NFT
            </p>
          </Card>

          <Card>
            <div className={styles.icon_container}>
              <FontAwesomeIcon icon={faUserPlus} className={styles.icon} />
            </div>
            <h3 className={styles.card_heading}>Choose Beneficiary</h3>
            <p className={styles.card_paragraph}>
              You are at liberty to select as many beneficiaries as you want
              just as you would in a traditional will.
            </p>
          </Card>

          <Card>
            <div className={styles.icon_container}>
              <FontAwesomeIcon icon={faCalendarPlus} className={styles.icon} />
            </div>
            <h3 className={styles.card_heading}>Set Release Date</h3>
            <p className={styles.card_paragraph}>
              You pick a date for when the assets will be released to the
              beneficiary of your choosing. This can be a week, month or year(s)
            </p>
          </Card>

          <Card>
            <div className={styles.icon_container}>
              <FontAwesomeIcon
                icon={faHandHoldingHeart}
                className={styles.icon}
              />
            </div>
            <h3 className={styles.card_heading}>
              Assets Released To Beneficiary
            </h3>
            <p className={styles.card_paragraph}>
              Upon elapse of the pre-set release date, the assets gifted to a
              beneficiary gets released to their wallet.
            </p>
          </Card>
        </div>
        {/* <div className={styles.card_container2}></div> */}
      </section>
    );
}

export default How