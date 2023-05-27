import React, { useState, useEffect } from 'react';
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { toast } from "react-toastify";


import { WillsContractAddress, WillsAbi, TokenAbi, NFTAbi } from '../../Utils/constance';
import Card from '../../components/UI/Card/Card';
import Testator from './Testator';
import Form from './Form';
import styles from "./Dashboard.module.css";

const toastStyles = {
position: "top-right",
autoClose: 10000,
hideProgressBar: false,
closeOnClick: true,
pauseOnHover: true,
draggable: true,
theme: "dark",
}

const TestatorDashboard = () => {
  const account = useAccount();
  const [willsContract, setWillsContract] = useState(null);
  const [formData, setFormData] = useState(null);
  const [dateFormatted, setDateFormatted] = useState(false);
  const [approvalForAllGiven, setApprovalForAllGiven] = useState(false);
  const [giftCreated, setGiftCreated] = useState(false);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  useEffect(() => {
    setContract();
  }, []);

  useEffect(() => {
    if (dateFormatted) {
      handleGiftCreate();
    }
  }, [formData]);

  const setContract = async () => {
    const WillsContract = new ethers.Contract(
      WillsContractAddress,
      WillsAbi,
      signer
    );
    setWillsContract(WillsContract);
  };

  const handleFormSubmit = (data) => {
    setFormData(data);
    amendData();
  };

  const amendData = () => {
    setFormData((prevData) => {
      return {
        ...prevData,
        releaseDate: formatReleaseDate(prevData.releaseDate),
      };
    });
  };

  const formatReleaseDate = (date) => {
    setDateFormatted(true);
    const newDate = new Date(date);
    return newDate.getTime() / 1000;
  };

  const handleGiftCreate = () => {
    if (formData.giftType == "ether") {
      handleCreateEtherGift();
    } else if (formData.giftType == "token") {
      handleCreateTokenGift();
    } else if (formData.giftType == "nft") {
      if (approvalForAllGiven) {
        handleCreateNFTGift();
      } else if (!approvalForAllGiven) {
        handleCreateNFTGiftWithApproval();
        setApprovalForAllGiven(true);
      }
    }
    setDateFormatted(false);
    setFormData({
      giftType: "",
      contractAddress: "",
      beneficiaryAddress: "",
      value: "",
      releaseDate: "",
    });
  };

  const handleCreateEtherGift = async () => {
    try {
      const amount = formData?.value;
      const etherCreateTransaction = await willsContract.createEtherGift(
        formData?.beneficiaryAddress,
        amount,
        formData?.releaseDate,
        { value: ethers.utils.parseUnits(amount, 18) }
      );
      await etherCreateTransaction.wait();
      toast.success("Gifted Ether Successfully", toastStyles);
      setGiftCreated((prevCreation) => !prevCreation);
    } catch (error) {
      toast.error(`Ether Gift creation failed`, toastStyles);
      console.log(error.message)
    }
  };

  const handleCreateTokenGift = async () => {
    try {
      const tokenContract = new ethers.Contract(
        formData?.contractAddress,
        TokenAbi,
        signer
      );
      const approveContractTransaction = await tokenContract.approve(
        WillsContractAddress,
        formData?.value
      );
      await approveContractTransaction.wait();

      const tokenGiftCreateTransaction =
        await willsContract.createFungibleTokenGift(
          formData?.contractAddress,
          formData?.beneficiaryAddress,
          formData?.value,
          formData?.releaseDate
        );
      await tokenGiftCreateTransaction.wait();
      toast.success("Gifted Tokens Successfully", toastStyles);
      setGiftCreated((prevCreation) => !prevCreation);
    } catch (error) {
      toast.error(`Token Gift creation failed`, toastStyles);
    }
  };

  const handleCreateNFTGiftWithApproval = async () => {
    try {
      const nftContract = new ethers.Contract(
        formData?.contractAddress,
        NFTAbi,
        signer
      );
      const approvalForAllTransaction = await nftContract.setApprovalForAll(
        WillsContractAddress,
        true
      );
      await approvalForAllTransaction.wait();

      const nftGiftCreateTransaction = await willsContract.createNFTGift(
        formData?.contractAddress,
        formData?.beneficiaryAddress,
        formData?.value,
        formData?.releaseDate
      );
      await nftGiftCreateTransaction.wait();
      toast.success("Gifted NFT Successfully", toastStyles);
      setGiftCreated((prevCreation) => !prevCreation);
    } catch (error) {
      toast.error(`NFT Gift creation failed`, toastStyles);
    }
  };

  const handleCreateNFTGift = async () => {
    try {
      const nftGiftCreateTransaction = await willsContract.createNFTGift(
        formData?.contractAddress,
        formData?.beneficiaryAddress,
        formData?.value,
        formData?.releaseDate,
        { gasLimit: 600000 }
      );
      await nftGiftCreateTransaction.wait();
      toast.success("Gifted NFT Successfully", toastStyles);
      setGiftCreated((prevCreation) => !prevCreation);
    } catch (error) {
      toast.error(`Gift failed because ${error.message}`, toastStyles);
    }
  };

  return (
    <section className={styles.testator_section}>
      {account.isConnected ? (
        <div className={styles.main_container}>
          <Card>
            <Testator
              giftCreated={giftCreated}
              userAccount={account}
              willsContract={willsContract}
            />
          </Card>
          <div className={styles.form_container}>
            <Form onFormSubmit={handleFormSubmit} />
            <div className="btn_container">
              <a href="/dashboard/beneficiary" className={styles.switch_btn}>
                Switch Dashboard
              </a>
            </div>
          </div>
        </div>
      ) : (
        <h2 className={styles.pretext}>
          Connect Your Wallet to start gifting your assets.
        </h2>
      )}
    </section>
  );
};

export default TestatorDashboard;