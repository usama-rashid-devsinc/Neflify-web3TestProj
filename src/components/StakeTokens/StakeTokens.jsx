import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useContractRead, useContractWrite } from "wagmi";
import {
  NFTContract,
  StakingToken,
  TokenStakingContract,
} from "../wagmiConfigurations";

/* global BigInt */

export default function StakeTokens({ currentUser }) {
  const [stakeValue, setStakeValue] = useState(0);
  const [Approval, setApproval] = useState(false);
  const [Displayerror, setError] = useState("");
  const [StakingInfos, setStakingInfos] = useState([]);
  const [ApprovalValue, setApprovalValue] = useState(0);
  const { data: Approvalval } = useContractRead({
    ...StakingToken,
    functionName: "allowance",
    args: [currentUser, TokenStakingContract.address],
  });

  useEffect(() => {
    if (Approvalval != undefined) {
      if (parseInt(Approvalval._hex, 16) === 0) setApproval(false);
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
  const { isSuccess, write: AppovalWrite } = useContractWrite({
    ...StakingToken,
    functionName: "approve",
    args: [TokenStakingContract.address, BigInt(ApprovalValue * 10 ** 18)],
  });

  useEffect(() => {}, [isSuccess]);

  async function handleapprovalfunc() {
    console.log("Stake value handle Stake :", stakeValue);
    if (ApprovalValue < 0) {
      setError("Cannot Approve a negative value");
    } else if (ApprovalValue === 0 && stakingApprovalVal === 0) {
      setError("Already Approved 0 Tokens");
    } else {
      AppovalWrite({});
    }
  }

  const { data: stakingApprovalVal } = useContractRead({
    ...StakingToken,
    functionName: "allowance",
    args: [currentUser, TokenStakingContract.address],
  });
  useEffect(() => {
    // if (stakingApprovalVal != undefined)
    console.log("1.Current Approval:", stakingApprovalVal);
  }, [stakingApprovalVal]);
  /* ##############################################  */

  // HANDLING of Input Feild
  const handleChange = (event) => {
    setStakeValue(event.target.value);
  };

  const handleChangeApproval = (event) => {
    setApprovalValue(event.target.value);
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
      // console.log("Settled", { data, error });
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
    args: [BigInt(stakeValue * 10 ** 18)],
    onSettled(data, error) {
      setError(error.reason);
      // console.log("Settled", { data, error });
    },
  });
  async function handleStake() {
    console.log("Stake value handle Stake :", stakeValue);
    if (stakeValue < 0) {
      setError("Cannot Stake a negative value");
    } else if (stakeValue === 0) {
      setError("Cannot Stake 0 Tokens");
    } else if (stakeValue * 10 ** 18 > stakingBal) {
      setError("Enter a Amount less than or equal to the current balance");
    } else {
      // Call the Staking contract
      StakeTokensWrite({});
    }
  }

  useEffect(() => {
    console.log("Data StakeData:");
  }, [StakeData]);

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
                amountClaimed: parseInt(result.amountClaimed._hex, 16),
                RewardCreated: parseInt(result.RewardCreated._hex, 16),
                dayPassed: parseInt(result.dayPassed._hex, 16),
                previousRewards: parseInt(result.previousRewards._hex, 16),

                // RewardOnPrincipal: parseInt(result.RewardOnPrincipal._hex, 16),

                // uint256 amountStaked,
                // uint256 amountClaimed,
                // uint256 RewardCreated,
                // uint256 dayPassed,
                // uint256 previousRewards
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
    <div className="container">
      <h4 style={{ color: "#267aa4" }}>
        Stake your StakingTokens to get 0.07% RewardTokens Daily
      </h4>

      {currentUser ? (
        <div className="row" style={{ align: "center", padding: "2em" }}>
          <div className="col-lg-6 p-1">
            <h4 style={{ color: "#267aa4" }}>Stake Tokens</h4>
            <h4>
              StakingTokens balance :{" "}
              {stakingBal !== undefined || stakingBal != null
                ? parseInt(stakingBal._hex, 16) / 10 ** 18
                : 0}
            </h4>
            <h5>
              Your Current Approval:
              {stakingApprovalVal !== undefined &&
                parseInt(stakingApprovalVal._hex, 16) / 10 ** 18}
            </h5>
            <div>
              <div>
                Approve this Contract to Transfer your Staking Tokens:
                <br />
                Enter Approval Amount: {Approval}
                <input
                  style={{ width: "250px" }}
                  type="number"
                  value={ApprovalValue}
                  onChange={handleChangeApproval}
                />
                <Button
                  style={{ paddingLeft: "0.5em" }}
                  onClick={handleapprovalfunc}
                >
                  Approve
                </Button>
              </div>
              Enter Amount to stake: {Approval}
              <input
                style={{ width: "250px" }}
                type="number"
                value={stakeValue}
                onChange={handleChange}
              />
              <Button onClick={handleStake}>Stake</Button>
              <hr />
              <div>
                <h4 style={{ color: "#267aa4" }}>
                  {" "}
                  Unstake Tokens:
                  {"  "} <Button onClick={handleUnStake}>UnStake</Button>
                </h4>
              </div>
            </div>
          </div>

          <div className="col-lg-6 p-1">
            <h4 style={{ color: "#267aa4" }}>Staking Details</h4>
            {StakingInfos.length > 0 ? (
              StakingInfos.map((result) => {
                return (
                  <div id={result.amountClaimed}>
                    <div> Amount Staked: {result.amountStaked / 10 ** 18}</div>
                    <div> RewardCreated: {result.RewardCreated / 10 ** 18}</div>
                    <div> dayPassed: {result.dayPassed}</div>
                    <div> amountClaimed: {result.amountClaimed / 10 ** 18}</div>
                    <div>
                      previousRewards: {result.previousRewards / 10 ** 18}
                    </div>
                  </div>
                );
              })
            ) : (
              // Since User has Not Staked So show All values as Zero
              <div>
                <div> Amount Staked: 0</div>
                <div> RewardCreated: 0</div>
                <div> dayPassed: 0</div>
                <div> amountClaimed: 0</div>
                <div>previousRewards: 0</div>
              </div>
            )}
            <Button onClick={ClaimDailyhandler}>Claim Daily Reward </Button>
          </div>
          {Displayerror != undefined && Displayerror.length > 0 && (
            <div style={{ backgroundColor: "red" }}>{Displayerror}</div>
          )}
        </div>
      ) : (
        // When Wallet is Not Connected Show the Following :
        <div style={{ textAlign: "center", align: "center", padding: "2em" }}>
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
