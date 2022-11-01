import React, { useEffect, useState } from "react";

import { RewardingToken, StakingToken } from "../wagmiConfigurations";
import { useContractRead } from "wagmi";

const TokensInfo = ({ currentUser }) => {
  console.log("TOKEN ->currentUser:", currentUser);

  const { data: stakingBal } = useContractRead({
    ...StakingToken,
    functionName: "balanceOf",
    args: [currentUser],
  });

  const { data: rewardingBal } = useContractRead({
    ...RewardingToken,
    functionName: "balanceOf",
    args: [currentUser],
  });

  // const { data: stakingOwner } = useContractRead({
  //   ...RewardingToken,
  //   functionName: "owner",
  //   // args: [],
  // });
  useEffect(() => {
    console.log("Data now:", stakingBal);
  }, [stakingBal]);
  useEffect(() => {
    console.log("Data now:", rewardingBal);
  }, [rewardingBal]);

  // useEffect(() => {
  //   console.log("Data ownernow:", stakingOwner);
  // }, [stakingOwner]);

  return currentUser != null || currentUser != undefined ? (
    <div style={{ align: "center", padding: "2em" }}>
      <h3>
        <b>Your Currently Owned Tokens & NFTS</b>
      </h3>

      <div>
        <h4>
          Staking Tokens :{" "}
          {stakingBal != undefined || stakingBal != null
            ? parseInt(stakingBal._hex, 16) / 10 ** 5
            : 0}
        </h4>
        <h4>
          {/* Rewarding Tokens :{" "}
          {rewardingBal != "undefined" || rewardingBal != null
            ? parseInt(rewardingBal._hex, 16) / 10 ** 5
            : 0} */}
          Rewarding Tokens : {rewardingBal == "undefined" && 0}
          {rewardingBal && parseInt(rewardingBal._hex, 16) / 10 ** 5}
        </h4>
      </div>
    </div>
  ) : (
    <div style={{ textAlign: "center" }}>
      <h4>Connect your Wallet to see Tokens Infos</h4>
      <div>Kindly Connect to Binance Smart Chain (TestNet)</div>
    </div>
  );
};

// const TestEther = async function () {
//   console.log("signer", signer);
//   const blocknumber = await provider.getBlockNumber();
//   console.log("block number: " + blocknumber);
//   const name = await StakingContract.name();
//   console.log("name: " + name);
//   const symbol = await StakingContract.symbol();
//   console.log("symbol: " + symbol);
//   const totalSupply = await StakingContract.totalSupply();
//   console.log("totalSupply: " + totalSupply);
//   const balanceOfAddr = await StakingContract.balanceOf(currentUser);
//   console.log(
//     "balanceOf this Address" + currentUser + ":" + typeof balanceOfAddr
//   );

// };
// useEffect(() => {
//   //Function Definition
//   async function getBalance() {
//     // console.log("ASYNC FUNC CALLED", currentUser);
//     if (currentUser != null) {
//       // console.log("Current user is not null");
//       // await StakingContract.balanceOf(currentUser).then((result) => {
//       //   setStakingTokenBalance(result);
//       // });
//       // await RewardingContract.balanceOf(currentUser).then((result) => {
//       // setRewardingTokenBalance(result);
//       // });
//       // if (data != undefined) {
//       //   setStakingTokenBalance(data);
//       // }
//     } else {
//       setStakingTokenBalance(0);
//       setRewardingTokenBalance(0);
//       // console.log("Current use id null");
//     }
//   }
//   // Function calls
//   getBalance();
// }, [currentUser]);

export default TokensInfo;
