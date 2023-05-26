import React, { useState} from "react";
import { useAccount } from "wagmi";

import Card from "../../components/UI/Card/Card";
import Beneficiary from "./Beneficiary";
import Form from "./Form";
import styles from "./Dashboard.module.css";


const BeneficiaryDashboard = () => {
  const [testatorAddress, setTestatorAddress] = useState(null);
  const account = useAccount();



  const handleFormSubmit = (data) => {
    setTestatorAddress(data);
  };

  return (
    <>
      {account.isConnected ? (
        <section className={styles.main_container}>
          <Card>
            <Beneficiary testator={testatorAddress} />
          </Card>
          <div className={styles.form_container}>
            <Form onFormSubmit={handleFormSubmit} />
            {testatorAddress ? (
              <div className="btn_container">
                <a href="/dashboard/testator" className={styles.switch_btn}>
                  Switch Dashboard
                </a>
              </div>
            ) : null}
          </div>
        </section>
      ) : (
        <h2 className={styles.pretext}>
          Connect Your Wallet to see your recieved gifts.
        </h2>
      )}
    </>
  );
};

export default BeneficiaryDashboard;
