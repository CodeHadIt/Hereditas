import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import FormCard from "../../components/UI/Card/FormCard";
import Button from "../../components/UI/Buttons/Button";
import styles from "./Form.module.css";

const Form = (props) => {
  const [formInitiated, setFormInitiated] = useState(false);
  const [testatorAddress, setTestatorAddress] = useState("");
  const [focused, setFocused] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleGiftData = (event) => {
    setTestatorAddress(event.target.value);
  };

  const handleFocused = () => {
    setFocused(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    props.onFormSubmit(testatorAddress);
    setTestatorAddress("");
    setFormInitiated(false);
  };

  return (
    <div className={styles.container}>
      <FormCard>
        {!formInitiated ? (
          <>
            <Button className={styles.btn} onClick={()=> {setFormInitiated(true)}}>
              Add Testator
            </Button>
          </>
        ) : (
          <form action="" onSubmit={handleFormSubmit}>
            <div className={styles.form_control}>
              <input
                name="testatorAddress"
                type="text"
                placeholder="Testator Address"
                pattern="^[a-zA-Z0-9]{42}$"
                className={`${styles.form_field}`}
                onChange={handleGiftData}
                onBlur={() => {
                  handleFocused();
                }}
                focused={focused.toString()}
                required
              />
              <span className={styles.error_message}>
                Testator Address should be 42 characters long
              </span>
              <div className={styles.icon_container}>
                {showInfo && (
                  <div className={`${styles.popup_container}`}>
                    <p className={`${styles.popup_text}`}>
                      Input the address of the Testator whose gift's you'd like
                      to claim.
                    </p>
                  </div>
                )}
                {showInfo && (
                  <div
                    className={styles.overlay}
                    onClick={() => {
                      setShowInfo(false);
                    }}
                  ></div>
                )}
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className={styles.info_icon}
                  onClick={() => {
                    setShowInfo(true);
                  }}
                />
              </div>
            </div>
            <Button type="submit">See Gifts</Button>
          </form>
        )}
      </FormCard>
    </div>
  );
};

export default Form;
