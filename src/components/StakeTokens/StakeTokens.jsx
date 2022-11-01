import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useContractRead, useContractWrite } from "wagmi";
import {
  NFTContract,
  StakingToken,
  TokenStakingContract,
} from "../wagmiConfigurations";

export default function StakeTokens({ currentUser }) {
  const [stakingTokenBalance, setStakingTokenBalance] = useState(0);
  const [stakeValue, setStakeValue] = useState(0);
  const [Approval, setApproval] = useState(false);
  const [Displayerror, setError] = useState("");
  const [StakingInfos, setStakingInfos] = useState([]);
  const { data: Approvalval } = useContractRead({
    ...StakingToken,
    functionName: "allowance",
    args: [currentUser, TokenStakingContract.address],
  });

  useEffect(() => {
    // console.log("Data Approvalval:", parseInt(Approvalval._hex, 16) / 10 ** 5);
    if (Approvalval != undefined) {
      if (parseInt(Approvalval._hex, 16) == 0) setApproval(false);
      else setApproval(true);
    }
  }, [Approvalval]);

  const { data: stakingBal } = useContractRead({
    ...StakingToken,
    functionName: "balanceOf",
    args: [currentUser],
  });

  useEffect(() => {
    console.log("Data stakingBal Bal:", stakingBal);
  }, [stakingBal]);

  useEffect(() => {}, [currentUser]);

  /* ##############################################  */
  /* Approval To StakingTokenContract */
  /* ##############################################  */
  const {
    data: AppovalWritedata,
    isSuccess,
    write: AppovalWrite,
  } = useContractWrite({
    ...StakingToken,
    functionName: "approve",
    args: [TokenStakingContract.address, stakingBal],
  });

  useEffect(() => {
    console.log(
      "Data AppovalWritedata:"
      // AppovalWritedata
      // parseInt(AppovalWriteData._hex, 16) / 10 ** 5
    );
  }, [isSuccess]);

  async function handleapprovalfunc() {
    console.log(" Approval Handle called from button click");
    AppovalWrite({});
  }
  /* ##############################################  */

  // HANDLING of Input Feild
  const handleChange = (event) => {
    setStakeValue(event.target.value);
  };
  /* ##############################################  */

  const {
    data: unStakeData,

    write: unStakeTokensWrite,
  } = useContractWrite({
    ...TokenStakingContract,
    functionName: "unStakeTokens",
    onSettled(data, error) {
      setError(error.reason);
      console.log("Settled", { data, error });
    },
  });
  async function handleUnStake() {
    console.log("unStakeTokensWrite Handle");
    unStakeTokensWrite({});
  }
  useEffect(() => {
    console.log(
      "Data unStakeData:"
      // unStakeData
      // parseInt(BalOfCurrUser._hex, 16) / 10 ** 5
    );
  }, [unStakeData]);

  /* ##############################################  */
  // handling of Staking ofTokens
  const { data: StakeData, write: StakeTokensWrite } = useContractWrite({
    ...TokenStakingContract,
    functionName: "StakeTokens",
    args: [stakeValue * 10 ** 5],
    onSettled(data, error) {
      setError(error.reason);
      // console.log("Settled", { data, error });
    },
  });
  async function handleStake() {
    console.log("Stake value handle Stake :", stakeValue);
    if (stakeValue < 0) {
      setError("Cannot Stake a negative value");
    } else if (stakeValue == 0) {
      setError("Cannot Stake 0 Tokens");
    } else if (stakeValue * 10 ** 5 > stakingBal) {
      setError("Enter a Amount less than or equal to the current balance");
    } else {
      // Call the Staking contract
      StakeTokensWrite({});
    }
  }
  useEffect(() => {
    console.log(
      "Data StakeData:"
      // StakeData
      // parseInt(BalOfCurrUser._hex, 16) / 10 ** 5
    );
  }, [StakeData]);

  // const { data: StakingInfo } = useContractRead({
  //   ...TokenStakingContract,
  //   functionName: "viewStakeValue",
  //   // args: [currentUser],
  // });
  // useEffect(() => {
  //   console.log("Data:StakingInfo:", StakingInfo);
  // }, [StakingInfo]);

  useEffect(() => {
    setStakingInfos([]);
    async function getStakingValue() {
      // setCollection([]);
      // SetID([]);
      if (currentUser != null) {
        if (
          typeof window.ethereum !== "undefined" ||
          typeof window.web3 !== "undefined"
        ) {
          // Web3 browser user detected. You can now use the provider.
          // const accounts = await window.ethereum.request({
          //   method: "eth_requestAccounts",
          // });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const walletAddress = currentUser;
          const signer = provider.getSigner(walletAddress);
          console.log("accounts: ", currentUser);
          console.log("provider: ", provider);
          const NFTContractSigner = new ethers.Contract(
            TokenStakingContract.address,
            TokenStakingContract.abi,
            signer
          );
          await NFTContractSigner.viewStakeValue().then((result) => {
            console.log("Result back:", result);
            console.log(
              " amountStaked: result.amountStaked._hex",
              parseInt(result.amountStaked._hex, 16)
            );
            setStakingInfos((prevArray) => [
              ...prevArray,
              {
                amountStaked: parseInt(result.amountStaked._hex, 16),
                RewardCreated: parseInt(result.RewardCreated._hex, 16),
                RewardOnPrincipal: parseInt(result.RewardOnPrincipal._hex, 16),
                dayPassed: parseInt(result.dayPassed._hex, 16),
                amountClaimed: parseInt(result.amountClaimed._hex, 16),
                RewardOnPrincipal: parseInt(result.RewardOnPrincipal._hex, 16),
              },
            ]);
          });
        }
      } else {
      }
    }
    //Call the async functions
    getStakingValue();
    // StakingInfos.map((result) => {
    //   console.log("Result: StakingInfos: " + result.amountStaked);
    //   console.log(" RewardCreated:", result.RewardCreated);
    //   console.log(" RewardOnPrincipal:", result.RewardOnPrincipal);

    //   // RewardOnPrincipal
    // });
  }, [currentUser]);

  //################################ Claim Daily Reward
  const { data: ClaimDaily, write: ClaimDailyWrite } = useContractWrite({
    ...TokenStakingContract,
    functionName: "ClaimDailyRewards",
    // args: [stakeValue * 10 ** 5],
    onSettled(data, error) {
      setError(error.reason);
      // console.log("Settled", { data, error });
    },
  });

  useEffect(() => {
    console.log("ClaimDaily:", ClaimDaily);
  }, [ClaimDaily]);

  async function ClaimDailyhandler() {
    console.log("ClaimDaily handler called");
    ClaimDailyWrite({});
  }

  return (
    <div style={{ align: "center", padding: "2em" }}>
      {/* StakeTokens */}
      <h4>Stake your StakingTokens to get 0.07% RewardTokens Daily</h4>
      {/* <hr /> */}
      {currentUser ? (
        <div>
          <h4>
            StakingTokens balance :{" "}
            {stakingBal != undefined || stakingBal != null
              ? parseInt(stakingBal._hex, 16) / 10 ** 5
              : 0}
          </h4>
          <div>
            <input
              style={{ width: "250px" }}
              type="number"
              value={stakeValue}
              onChange={handleChange}
            />
            <Button onClick={handleStake}>Stake</Button>
            {!Approval && (
              <div>
                Approve this Contract to Transfer your Staking Tokens:
                <Button
                  style={{ paddingLeft: "0.5em" }}
                  onClick={handleapprovalfunc}
                >
                  Approve
                </Button>
              </div>
            )}

            <hr />
            <Button onClick={handleUnStake}>UnStake</Button>
            <hr />
            {StakingInfos.length > 0 &&
              StakingInfos.map((result) => {
                return (
                  <div>
                    <div> Amount Staked: {result.amountStaked / 10 ** 5}</div>
                    <div> RewardCreated: {result.RewardCreated / 10 ** 5}</div>
                    {/* <div> RewardOnPrincipal: {result.RewardOnPrincipal}</div> */}
                    <div> dayPassed: {result.dayPassed}</div>
                    <div> amountClaimed: {result.amountClaimed / 10 ** 5}</div>
                    {/* <div> RewardOnPrincipal: {result.RewardOnPrincipal}</div> */}
                  </div>
                );
              })}
            <Button onClick={ClaimDailyhandler}>Claim Daily Reward </Button>
            <hr />
            {Displayerror != undefined && Displayerror.length > 0 && (
              <div style={{ backgroundColor: "red" }}>{Displayerror}</div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h4>Connect your Wallet to start staking</h4>
          <div>Kindly Connect to Binance Smart Chain (TestNet)</div>
        </div>
      )}
    </div>
  );
}

// STAKE
// UnStake
// Approve this Contract to Transfer Tokens
// Daily Reward Current;
