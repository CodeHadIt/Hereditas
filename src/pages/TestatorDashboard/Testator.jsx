import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";

import {   WillsContractAddress,
  WillsAbi, TokenAbi, NFTAbi } from "../../Utils/constance";
import CancelButton from "../../components/UI/Buttons/CancelButton";
import styles from "./Testator.module.css";

const toastStyles = {
  position: "top-right",
  autoClose: 10000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];


const Testator = (props) => {
  const [lengthOfBeneficiaries, setLengthOfBeneficiaries] = useState(0)
  const [testatorEtherGifts, setTestatorEtherGifts] = useState([]);
  const [testatorTokenGifts, setTestatorTokenGifts] = useState([]);
  const [testatorNftGifts, setTestatorNftGifts] = useState([]);
  const [currentTime, setCurrentTime] = useState(null);
  const [giftCancelled, setGiftCancelled] = useState("")


  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const account = useAccount();

  useEffect(() => {
    loadData();
    getCurrentTime();
  }, [props.giftCreated, giftCancelled]);


  const getCurrentTime = () => {
      const newDate = new Date();
      const currentTime = parseInt(newDate.getTime() / 1000);
      setCurrentTime(currentTime);
  }


  const mergeEtherGifts = async (gift, index) => {
    const testatorAddress = gift.testator;
    const beneficiaryAddress = gift.beneficiary;
    const releasedStatus = gift.released;
    const value = ethers.utils.formatUnits(gift.amount.toString(), 0);
    const timestamp = ethers.utils.formatUnits(gift.releaseDate.toString(), 0);
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const preSuffixDay = date.getDate();
    const day = getOrdinalSuffix(preSuffixDay);
    const giftObj = {
      giftIndex: index,
      testator: testatorAddress,
      beneficiary: beneficiaryAddress,
      value: value,
      rawReleaseDate: timestamp,
      releaseDay: day,
      releaseMonth: month,
      releaseYear: year,
      released: releasedStatus,
    };
    return giftObj;
  };
  const mergeTokenGifts = async (gift, index) => {
    const contractAddress = gift.tokenAddress;
    const testatorAddress = gift.testator;
    const beneficiaryAddress = gift.beneficiary;
    const releasedStatus = gift.released;
    const value = ethers.utils.formatUnits(gift.amount.toString(), 0);
    const timestamp = ethers.utils.formatUnits(gift.releaseDate.toString(), 0);
    const tokenName = await getTokenName(contractAddress);
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const preSuffixDay = date.getDate();
    const day = getOrdinalSuffix(preSuffixDay);
    const giftObj = {
      giftIndex: index,
      contractAddress: contractAddress,
      tokenName: tokenName,
      testator: testatorAddress,
      beneficiary: beneficiaryAddress,
      value: value,
      rawReleaseDate: timestamp,
      releaseDay: day,
      releaseMonth: month,
      releaseYear: year,
      released: releasedStatus,
    };
    return giftObj;
  };

  const mergeNftGifts = async (gift, index) => {
    const contractAddress = gift.contractAddress;
    const testatorAddress = gift.testator;
    const beneficiaryAddress = gift.beneficiary;
    const releasedStatus = gift.released;
    const tokenId = ethers.utils.formatUnits(gift.tokenId.toString(), 0);
    const timestamp = ethers.utils.formatUnits(gift.releaseDate.toString(), 0);
    const nftUriData = await getTokenURI(contractAddress, tokenId);
    const uri = nftUriData.uri;
    const nftImageData = await fetchNftData(uri);
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const preSuffixDay = date.getDate();
    const day = getOrdinalSuffix(preSuffixDay);
    const giftObj = {
      giftIndex: index,
      collectionName: nftUriData.collectionName,
      contractAddress: contractAddress,
      testator: testatorAddress,
      beneficiary: beneficiaryAddress,
      tokenId: tokenId,
      rawReleaseDate: timestamp,
      releaseDay: day,
      releaseMonth: month,
      releaseYear: year,
      released: releasedStatus,
      nftImage: nftImageData.image,
      nftImageName: nftImageData.name,
    };
    return giftObj;
  };

  const getTokenName = async(address) => {
    const tokenContract = new ethers.Contract(address, TokenAbi, signer);
    const tokenNameTransaction = await tokenContract.name();
    return tokenNameTransaction;
  }

  const getTokenURI = async(address, id) => {
    const nftContract = new ethers.Contract(address, NFTAbi, signer);
    const tokenUriTransaction = await nftContract.tokenURI(id);

    const collectionNameTransaction = await nftContract.name();
    return {
      uri: tokenUriTransaction,
      collectionName: collectionNameTransaction,
    };
  }

  const fetchNftData = async(uri) => {
      const response = await fetch(uri);
      const metadata = await response.json();
      return {
        image: metadata.image,
        name: metadata.name,
      };
  }

  // Utility function to get proper date
  const getOrdinalSuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return `${day}th`;
    }
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  const loadData = async () => {
    const WillsContract = new ethers.Contract(
      WillsContractAddress,
      WillsAbi,
      signer
    );
    //Length of Beneficiaries
    const lengthOfBeneficiaries = await WillsContract.getListOfBeneficiaries(
      account.address
    );
    setLengthOfBeneficiaries(lengthOfBeneficiaries)
    const formattedLength = ethers.utils.formatUnits(lengthOfBeneficiaries, 0)
    const beneficiaries = [];

    //Loop through the Number of Beneficiaries to pluck out the beneficiaries into an array.
    for(let i = 0; i < lengthOfBeneficiaries; i++) {
      const beneficiary = await WillsContract.listOfBeneficiaries(account.address, i);
      beneficiaries.push(beneficiary);
    }

    //Initializing the Length of Gifts given to each beneficiary
    let etherGiftsLength = 0, tokenGiftsLength = 0, nftGiftsLength = 0;

    const TOKEN_GIFTS = [];
    const NFT_GIFTS = [];
    const ETHER_GIFTS = [];

    //Looping through the beneficiaries array and querying the contract to get the length of gifts given to each beneficiary
    for(let i = 0; i < beneficiaries.length; i++) {
      let beneficiary = beneficiaries[i]
      const lengthOfEtherGifts = await WillsContract.getGiftLength(
        "",
        account.address,
        beneficiary
      );
      etherGiftsLength = lengthOfEtherGifts;

      const lengthOfTokenGifts = await WillsContract.getGiftLength(
        "ERC20",
        account.address,
        beneficiary
      );
      tokenGiftsLength = lengthOfTokenGifts;

      const lengthOfNftGifts = await WillsContract.getGiftLength(
        "NFT",
        account.address,
        beneficiary
      );
      nftGiftsLength = lengthOfNftGifts;

    //Next, we use loop through the length of the gifts given to a beneficary and use the index(num of gifts) to pluck the actual gifts given to the each beneficiary. We then push each of these gifts into their own seperate array.

      //Getting All Ether Gifts
      for (let i = 0; i < etherGiftsLength; i++) {
        let index = i;
        //Getting the gift given to the particular beneficiary.
        const etherGifts = await WillsContract.etherGifts(
          account.address,
          beneficiary,
          index
        );
        //formatting/cleaning the return data with utility functions
        const mergedGift = await mergeEtherGifts(etherGifts, index);
        ETHER_GIFTS.push(mergedGift);
      }

      //Getting All Token Gifts
      for (let i = 0; i < tokenGiftsLength; i++) {
        let index = i;
        const tokenGifts = await WillsContract.tokenGifts(
          account.address,
          beneficiary,
          index
        );
        const mergedGift = await mergeTokenGifts(tokenGifts, index);
        TOKEN_GIFTS.push(mergedGift);
      }

      //Getting All NFT Gifts
      for (let i = 0; i < nftGiftsLength; i++) {
        let index = i;
        const nftGifts = await WillsContract.nftGifts(
          account.address,
          beneficiary,
          index
        );
        const mergedGift = await mergeNftGifts(nftGifts, index)
        NFT_GIFTS.push(mergedGift);
      }
    }
    setTestatorEtherGifts(ETHER_GIFTS);
    setTestatorTokenGifts(TOKEN_GIFTS);
    setTestatorNftGifts(NFT_GIFTS);
  }


const handleCancelEtherGift = async (id, beneficiary, value) => {
  try {
    const WillsContract = new ethers.Contract(
      WillsContractAddress,
      WillsAbi,
      signer
    );
    const cancelEtherTransaction = await WillsContract.cancelEtherGift(
      id,
      beneficiary
    );
    await cancelEtherTransaction.wait();
    toast.success(
      `Successfully cancelled your ${value} Ether Gift`,
      toastStyles
    );
    setGiftCancelled("Ether Gift Cancelled");
  } catch (error) {
    toast.error(`Ether Gift cancellation failed`, toastStyles);
    console.log(error)
  }
};
const handleCancelTokenGift = async (id, beneficiary, value, name) => {
  try {
    const WillsContract = new ethers.Contract(
      WillsContractAddress,
      WillsAbi,
      signer
    );
    const cancelTokenTransaction = await WillsContract.cancelFungibleTokenGift(
      id,
      beneficiary
    );
    await cancelTokenTransaction.wait();
    toast.success(
      `Successfully cancelled your ${value} ${name} Gift`,
      toastStyles
    );
    setGiftCancelled("Token Gift Cancelled");
  } catch (error) {
    toast.error(`Token Gift cancellation failed`, toastStyles);
    console.log(error);
  }
};
const handleCancelNftGift = async (id, beneficiary, value, name) => {
  try {
    const WillsContract = new ethers.Contract(
      WillsContractAddress,
      WillsAbi,
      signer
    );
    const cancelTokenTransaction = await WillsContract.cancelNFTGift(
      id,
      beneficiary
    );
    await cancelTokenTransaction.wait();
    toast.success(
      `Successfully cancelled your ${value} ${name} Gift`,
      toastStyles
    );
    setGiftCancelled("NFT Gift Cancelled");
  } catch (error) {
    toast.error(`NFT Gift Cancellation failed`, toastStyles);
    console.log(error);
  }
};



const AllEtherGifts = testatorEtherGifts?.map((gift, index) => (
  <div key={index}>
    <div className={styles.beneficiary_details}>
      <h4 className={styles.address}>{`${gift.beneficiary.slice(
        0,
        6
      )}...${gift.beneficiary.slice(38, 42)}`}</h4>
      <p>Beneficiary</p>
    </div>
    <div className={styles.gifts}>
      <div className={styles.gift_type}>
        <h5>{gift.value}</h5>
        <p>Ether</p>
      </div>
      <div className={styles.due_date}>
        <h5>
          {gift.releaseDay} {gift.releaseMonth} {gift.releaseYear}
        </h5>
        <p>Due date</p>
      </div>
      <div className={styles.status}>
        {gift.rawReleaseDate > currentTime ? (
          <>
            <FontAwesomeIcon
              icon={faHourglassHalf}
              className={`${styles.icon} ${styles.icon_pending}`}
            />
            <p>Pending</p>
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faCheckCircle}
              className={`${styles.icon} ${styles.icon_due}`}
            />
            <p>{gift.released ? "Claimed" : "Due"}</p>
          </>
        )}
      </div>
      {!gift.released ? (
        <div className={styles.cancel_btn_container}>
          <CancelButton
            disabled={gift.released}
            onClick={() => handleCancelEtherGift(gift.giftIndex, gift.beneficiary, gift.value)}
          >
            Cancel
          </CancelButton>
        </div>
      ) : null}
    </div>
    <div className={styles.gift_seperator}></div>
  </div>
));

const AllTokenGifts = testatorTokenGifts?.map((gift, index) => (
  <div key={index}>
    <div className={styles.beneficiary_details}>
      <h4 className={styles.address}>{`${gift.beneficiary.slice(
        0,
        6
      )}...${gift.beneficiary.slice(38, 42)}`}</h4>
      <p>Beneficiary</p>
    </div>
    <div className={styles.gifts}>
      <div className={styles.gift_type}>
        <h5>{gift.value}</h5>
        <p>{gift.tokenName}</p>
      </div>
      <div className={styles.due_date}>
        <h5>
          {gift.releaseDay} {gift.releaseMonth} {gift.releaseYear}
        </h5>
        <p>Due date</p>
      </div>
      <div className={styles.status}>
        {gift.rawReleaseDate > currentTime ? (
          <>
            <FontAwesomeIcon
              icon={faHourglassHalf}
              className={`${styles.icon} ${styles.icon_pending}`}
            />
            <p>Pending</p>
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faCheckCircle}
              className={`${styles.icon} ${styles.icon_due}`}
            />
            <p>{gift.released ? "Claimed" : "Due"}</p>
          </>
        )}
      </div>
      {!gift.released ? (
        <div className={styles.cancel_btn_container}>
          <CancelButton
            disabled={gift.released}
            onClick={() =>
              handleCancelTokenGift(gift.giftIndex, gift.beneficiary, gift.value, gift.tokenName)
            }
          >
            Cancel
          </CancelButton>
        </div>
      ) : null}
    </div>
    <div className={styles.gift_seperator}></div>
  </div>
));

const AllNftGifts = testatorNftGifts?.map((gift, index) => (
  <div key={index}>
    <div className={styles.beneficiary_details}>
      <h4 className={styles.address}>{`${gift.beneficiary.slice(
        0,
        6
      )}...${gift.beneficiary.slice(38, 42)}`}</h4>
      <p>Beneficiary</p>
    </div>
    <div className={styles.img_container}>
      <img
        src={gift.nftImage}
        alt={`${gift.nftImageName}_nft`}
        className={styles.nft_image}
      />
    </div>
    <div className={styles.gifts}>
      <div className={styles.gift_type}>
        <h5>{`#${gift.tokenId}`}</h5>
        <p>{gift.collectionName}</p>
      </div>
      <div className={styles.due_date}>
        <h5>
          {gift.releaseDay} {gift.releaseMonth} {gift.releaseYear}
        </h5>
        <p>Due date</p>
      </div>
      <div className={styles.status}>
        {gift.rawReleaseDate > currentTime ? (
          <>
            <FontAwesomeIcon
              icon={faHourglassHalf}
              className={`${styles.icon} ${styles.icon_pending}`}
            />
            <p>Pending</p>
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faCheckCircle}
              className={`${styles.icon} ${styles.icon_due}`}
            />
            <p>{gift.released ? "Claimed" : "Due"}</p>
          </>
        )}
      </div>
      {!gift.released ? (
        <div className={styles.cancel_btn_container}>
          <CancelButton
            disabled={gift.released}
            onClick={() => handleCancelNftGift(gift.giftIndex, gift.beneficiary, gift.collectionName)}
          >
            Cancel
          </CancelButton>
        </div>
      ) : null}
    </div>
    <div className={styles.gift_seperator}></div>
  </div>
));
          
  return (
    <>
      {lengthOfBeneficiaries > 0 ? (
        <div className={styles.given_gifts}>
          <div className={styles.gift_types_container}>
            <h3 className={styles.gift_title}>Ether Gifts</h3>
            <div
              className={`${styles.seperators} ${styles.token_seperator}`}
            ></div>
            {AllEtherGifts}
          </div>

          <div className={styles.gift_types_container}>
            <h3 className={styles.gift_title}>Token Gifts</h3>
            <div
              className={`${styles.seperators} ${styles.token_seperator}`}
            ></div>
            {AllTokenGifts}
          </div>

          <div className={styles.gift_types_container}>
            <h3 className={styles.gift_title}>NFT Gifts</h3>
            <div
              className={`${styles.seperators} ${styles.nft_seperator}`}
            ></div>
            {AllNftGifts}
          </div>
        </div>
      ) : (
        <h2 className={styles.pretext}>Your Created Gifts Appear Here</h2>
      )}
    </>
  );
};

export default Testator;