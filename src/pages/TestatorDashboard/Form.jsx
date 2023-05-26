import React, {useRef, useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import Button from '../../components/UI/Buttons/Button';
import FormCard from '../../components/UI/Card/FormCard';
import styles from "./Form.module.css";


const today = new Date();
const day = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0"); 
const year = today.getFullYear();
//Set's the minimum date on the calender to the current date
const todaysDate = `${year}-${month}-${day}`;

const Form = (props) => {
    const [formInitiated, setFormInitiated] = useState(false);
    const [giftData, setGiftData] = useState({
        giftType: "",
        contractAddress: "",
        beneficiaryAddress: "",
        value: "",
        releaseDate: ""
    });
    const [focused, setFocused] = useState({
        contractAddress: false,
        beneficiaryAddress: false,
        value: false
    })

    const [showGiftInfo, setShowGiftInfo] = useState(false);
    const [showContractInfo, setShowContractInfo] = useState(false);
    const [showBeneficiaryInfo, setShowBeneficiaryInfo] = useState(false);
    const [showAmountInfo, setShowAmountInfo] = useState(false);
    const [showDateInfo, setShowDateInfo] = useState(false);

    const ref = useRef();

    const errorMessages = {
      contractAddress: "Contract Address should be 42 characters long",
      beneficiaryAddress: "Beneficiary Address should be 42 characters long",
      value: "The value of gift to be given should be more than 0",
    };

    const handleAddBeneficiary = () => {
        setFormInitiated(true);
    }

    const handleGiftData = (event) => {
        setGiftData(prevData => {
            return {
              ...prevData,
              [event.target.name]: event.target.value,
            };
        })
    }

    const handleFocused = (field) => {
        const otherGiftType = giftData.giftType != "ether"
        const etherGiftType = giftData.giftType == "ether"
        //if the gift type chosen is ether and the user omits contract address, field passes as valid;
        if (etherGiftType && field == "contractAddress") {
          setFocused((prevFocus) => {
            return {
              ...prevFocus,
              contractAddress: false,
            };
          });
        }
//General: If the field is the corresponding field and the user fails to input the required details, feild is invalid;
        //ContracAddressField: if the gift type is not ether and user omits adding contract address, field is invalid;
        if (otherGiftType && field == "contractAddress") {
          setFocused((prevFocus) => {
            return {
              ...prevFocus,
              contractAddress: true,
            };
          });
        } else if (field == "beneficiaryAddress") {
          setFocused((prevFocus) => {
            return {
              ...prevFocus,
              beneficiaryAddress: true,
            };
          });
        } else if (field == "value") {
          setFocused((prevFocus) => {
            return {
              ...prevFocus,
              value: true,
            };
          });
        }
        
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        props.onFormSubmit(giftData);
        setGiftData({        
            giftType: "",
            contractAddress: "",
            beneficiaryAddress: "",
            value: "",
            releaseDate: ""
        });
        setFormInitiated(false);
    }


    const handlePopupModal = (field) => {
        if (field == "gift"){
            setShowGiftInfo(true);
        } else if (field == "contract") {
            setShowContractInfo(true);
        } else if (field == "beneficiary") {
            setShowBeneficiaryInfo(true);
        } else if (field == "amount") {
            setShowAmountInfo(true);
        } else if (field == "date") {
            setShowDateInfo(true);
        }
    }
    const handleClearPopup = (field) => {
      if (field == "gift") {
        setShowGiftInfo(false);
      } else if (field == "contract") {
        setShowContractInfo(false);
      } else if (field == "beneficiary") {
        setShowBeneficiaryInfo(false);
      }else if (field == "amount") {
        setShowAmountInfo(false);
      } else if (field == "date") {
        setShowDateInfo(false);
      }
    };
    
    return (
      <div className={styles.container}>
        <FormCard>
          {!formInitiated ? (
            <>
              <Button className={styles.btn} onClick={handleAddBeneficiary}>
                Add beneficiary
              </Button>
              {props.TokenGiftLoading && (
                <h2 className={styles.gift_creation_load}>
                  ...creating your ERC20 gift for {giftData.beneficiaryAddress}{" "}
                </h2>
              )}
            </>
          ) : (
            <form action="" onSubmit={handleFormSubmit}>
              <div className={styles.form_control}>
                <select
                  name="giftType"
                  id="giftType"
                  value={giftData.giftType}
                  onChange={handleGiftData}
                  className={`${styles.form_field}`}
                  required
                >
                  <option value="" disabled defaultValue>
                    Choose Gift Type
                  </option>
                  <option value="ether">Ether</option>
                  <option value="token">Tokens other than Ether</option>
                  <option value="nft">NFT</option>
                </select>
                <div className={styles.icon_container}>
                  {showGiftInfo && (
                    <div className={`${styles.popup_container}`}>
                      <p className={`${styles.popup_text}`}>
                        Select the nature/type of the gift.
                      </p>
                    </div>
                  )}
                  {showGiftInfo && (
                    <div
                      className={styles.overlay}
                      onClick={() => {
                        handleClearPopup("gift");
                      }}
                    ></div>
                  )}
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className={styles.info_icon}
                    onClick={() => {
                      handlePopupModal("gift");
                    }}
                  />
                </div>
              </div>

              <div className={styles.form_control}>
                <input
                  name="contractAddress"
                  type="text"
                  placeholder="Contract Address"
                  pattern="^[a-zA-Z0-9]{42}$"
                  className={`${styles.form_field}`}
                  value={giftData.contractAddress}
                  onChange={handleGiftData}
                  onBlur={() => {
                    handleFocused("contractAddress");
                  }}
                  focused={focused.contractAddress.toString()}
                  required={
                    giftData.giftType == "token" || giftData.giftType == "nft"
                  }
                />
                <span className={styles.error_message}>
                  {errorMessages.contractAddress}
                </span>
                <div className={styles.icon_container}>
                  {showContractInfo && (
                    <div className={`${styles.popup_container}`}>
                      <p className={`${styles.popup_text}`}>
                        Input the contract address of the token/NFT to gift.{" "}
                        <span className={styles.popup_bold}>
                          {" "}
                          If Ether, leave blank.
                        </span>
                      </p>
                    </div>
                  )}
                  {showContractInfo && (
                    <div
                      className={styles.overlay}
                      onClick={() => {
                        handleClearPopup("contract");
                      }}
                    ></div>
                  )}
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className={styles.info_icon}
                    onClick={() => {
                      handlePopupModal("contract");
                    }}
                  />
                </div>
              </div>

              <div className={styles.form_control}>
                <input
                  name="beneficiaryAddress"
                  type="text"
                  placeholder="Beneficiary Address"
                  pattern="^[a-zA-Z0-9]{42}$"
                  className={`${styles.form_field}`}
                  value={giftData.beneficiaryAddress}
                  onChange={handleGiftData}
                  onBlur={() => {
                    handleFocused("beneficiaryAddress");
                  }}
                  focused={focused.beneficiaryAddress.toString()}
                  required
                />
                <span className={styles.error_message}>
                  {errorMessages.beneficiaryAddress}
                </span>
                <div className={styles.icon_container}>
                  {showBeneficiaryInfo && (
                    <div className={`${styles.popup_container}`}>
                      <p className={`${styles.popup_text}`}>
                        Input the address of the beneficiary. Only they can
                        claim the gift.
                      </p>
                    </div>
                  )}
                  {showBeneficiaryInfo && (
                    <div
                      className={styles.overlay}
                      onClick={() => {
                        handleClearPopup("beneficiary");
                      }}
                    ></div>
                  )}
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className={styles.info_icon}
                    onClick={() => {
                      handlePopupModal("beneficiary");
                    }}
                  />
                </div>
              </div>

              <div className={styles.form_control}>
                <input
                  name="value"
                  type="number"
                  placeholder="Gift Value"
                  min={giftData.giftType == "ether" ? "" : 1}
                  value={giftData.value}
                  onChange={handleGiftData}
                  onBlur={() => {
                    handleFocused("value");
                  }}
                  className={`${styles.form_field}`}
                  focused={focused.value.toString()}
                  required
                />
                <span className={styles.error_message}>
                  {errorMessages.value}
                </span>
                <div className={styles.icon_container}>
                  {showAmountInfo && (
                    <div className={`${styles.popup_container}`}>
                      <p className={`${styles.popup_text}`}>
                        Input the amount of tokens/Ether to gift. If gift is an
                        NFT,{" "}
                        <span className={styles.popup_bold}>
                          {" "}
                          input the TokenId of the NFT.
                        </span>
                      </p>
                    </div>
                  )}
                  {showAmountInfo && (
                    <div
                      className={styles.overlay}
                      onClick={() => {
                        handleClearPopup("amount");
                      }}
                    ></div>
                  )}
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className={styles.info_icon}
                    onClick={() => {
                      handlePopupModal("amount");
                    }}
                  />
                </div>
              </div>

              <div className={styles.form_control}>
                <input
                  name="releaseDate"
                  type="text"
                  placeholder="Pick Release Date"
                  min={todaysDate}
                  value={giftData.releaseDate}
                  ref={ref}
                  onChange={handleGiftData}
                  onFocus={() => (ref.current.type = "date")}
                  onBlur={() => (ref.current.type = "text")}
                  className={`${styles.form_field}`}
                  required
                />
                <div className={styles.icon_container}>
                  {showDateInfo && (
                    <div className={`${styles.popup_container}`}>
                      <p className={`${styles.popup_text}`}>
                        Pick the date you want the gift to become claimable.
                      </p>
                    </div>
                  )}
                  {showDateInfo && (
                    <div
                      className={styles.overlay}
                      onClick={() => {
                        handleClearPopup("date");
                      }}
                    ></div>
                  )}
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className={styles.info_icon}
                    onClick={() => {
                      handlePopupModal("date");
                    }}
                  />
                </div>
              </div>
              <Button type="submit">Add</Button>
            </form>
          )}
        </FormCard>
      </div>
    );
};

export default Form;