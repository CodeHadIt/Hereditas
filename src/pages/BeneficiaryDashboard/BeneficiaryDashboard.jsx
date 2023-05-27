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
    <section className={styles.beneficiary_section}>
      {account.isConnected ? (
        <div className={styles.main_container}>
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
        </div>
      ) : (
        <h2 className={styles.pretext}>
          Connect Your Wallet to see your recieved gifts.
        </h2>
      )}
    </section>
  );
};

export default BeneficiaryDashboard;
