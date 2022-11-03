import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import "./mycollection.css";
import { ethers } from "ethers";
import "../Global.css";
import { useContractRead, useContractWrite } from "wagmi";
import { NFTContract } from "../wagmiConfigurations";
import { Button } from "react-bootstrap";
import { merkleTree, whitelistAddresses } from "../EtherConfig";
import { keccak256 } from "ethers/lib/utils";
import MerkleTree from "merkletreejs";

const MyCollection = ({ currentUser }) => {
  console.log("MY collection Component");
  const [collection, setCollection] = useState([]);
  const [Tokens, SetID] = useState({});
  const [DiamondMintButton, setDiamondMintButton] = useState(false);
  const [Displayerror, setError] = useState("");
  const [hexProof, setHexProof] = useState("");

  useEffect(() => {
    async function getCollectionMetaData() {
      setCollection([]);
      SetID([]);
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
            NFTContract.address,
            NFTContract.abi,
            signer
          );
          await NFTContractSigner.CurrentlyOwnedTokens().then((result) => {
            console.log("result", result);
            result.map(async (token) => {
              console.log("TokenURI ", token);
              if (token != 0)
                await NFTContractSigner.tokenURI(token).then(async (uri) => {
                  console.log("TokenURI::: ", uri);
                  // const NewURi = uri.replace("/ ", "/");
                  // console.log("NewURi::: ", NewURi);
                  await fetch(
                    // uri.replace("ipfs://", "https://ipfs.io/ipfs/")
                    uri.replace("ipfs://", "https://ipfs.io/ipfs/")
                  )
                    .then((res) => res.json())
                    .then((Data) => {
                      console.log("Data", Data);
                      console.log(
                        "TokenData.attributes.itemType:",
                        Data.attributes[0].itemType
                      );
                      SetID((prevData) => [
                        ...prevData,
                        Data.attributes[0].itemType,
                      ]);
                      setCollection((prevArray) => [...prevArray, Data]);
                      console.log("CollectionCurrent :", collection);
                    });
                });
            });
          });
          console.log("Collection is collection:", collection);
        }
      } else {
        console.log("currentUser is null");
      }
    }

    async function MerkleHash() {
      if (currentUser != null) {
        const leafNodes = whitelistAddresses.map((addr) => keccak256(addr));
        const merkleTree = new MerkleTree(leafNodes, keccak256, {
          sortPairs: true,
        });

        const claimingAddress = keccak256(currentUser);
        const calculatedHexProof = merkleTree.getHexProof(claimingAddress);
        setHexProof(calculatedHexProof);
        // console.log("My Collection hexProof:", [...hexProof]);
      }
    }
    // Call of Async func in useState
    getCollectionMetaData();
    // MerkleHash();
    MerkleHash();
  }, [currentUser]);

  // useEffect(() => {}, [currentUser]);

  const {
    data: TokenID,
    isLoading: mintisLoading,
    isSuccess: mintisSuccess,
    write: mintDiamondToken,
    status: mintstatus,
  } = useContractWrite({
    ...NFTContract,
    functionName: "mintDiamondNFT",
    args: [hexProof],
    onSettled(data, error) {
      setError(error.reason);
      console.log("Settled", { data, error });
    },
  });

  useEffect(() => {
    let gold = 0;
    let silver = 0;
    let diamond = 0;
    let platinum = 0;
    async function setDiamondButton() {
      if (Tokens.length > 0) {
        Tokens.map((token) => {
          console.log(
            "IMG"
            // token.image.replace("ipfs://", "https://ipfs.io/ipfs/")
          );
          if (token == "Gold") {
            // return console.log("Token gold:", token);
            gold += 1;
          }
          if (token == "Silver") {
            // return console.log("Token Silver:", token);
            silver += 1;
          }
          if (token == "Platinum") {
            // return console.log("Token Platinum:", token);
            platinum += 1;
          }
          if (token == "Diamond") {
            // return console.log("Token Daimond:", token);
            diamond += 1;
          }
          // DiamondMintButton
        });
        console.log(
          "silver",
          silver,
          "gold",
          gold,
          "platinum",
          platinum,
          "diamond",
          diamond
        );
        if (diamond === 0 && gold === 1 && silver === 1 && platinum === 1) {
          setDiamondMintButton(true);
        }
      }
    }

    setDiamondButton();
  }, [collection]);

  const { data: TokensData } = useContractRead({
    ...NFTContract,
    functionName: "CurrentlyOwnedTokens",
    args: [],
  });
  useEffect(() => {
    if (TokensData != null || TokensData != undefined) {
      console.log("TOKENS DATA:", TokensData);
    }
  }, [TokensData]);

  return currentUser != null || currentUser != undefined ? (
    <div className="container p-0  ">
      <br></br>
      <br></br>

      <h3>Your Collectibles</h3>
      <div className="row">
        {collection.length > 0 &&
          collection.map((TokenData) => {
            return (
              <div
                className=" col-lg-3 p-1"
                key={TokenData.attributes[1].itemNumber}
              >
                <Card
                  className={
                    TokenData.attributes[0].itemType === "Silver"
                      ? "silver"
                      : TokenData.attributes[0].itemType === "Gold"
                      ? "gold"
                      : TokenData.attributes[0].itemType === "Platinum"
                      ? "platinum"
                      : "daimond"
                  }
                >
                  <Card.Img
                    variant="top"
                    src={TokenData.image.replace(
                      "ipfs://",
                      "https://ipfs.io/ipfs/"
                    )}
                  />
                  <Card.Body>
                    <Card.Title> {TokenData.name}</Card.Title>
                    <Card.Subtitle>{TokenData.description}</Card.Subtitle>

                    <Card.Text>
                      <b>Type:</b>
                      {TokenData.attributes[0].itemType}
                      <b>TokenID:</b>
                      {TokenData.attributes[1].itemNumber}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            );
          })}

        {collection.length == 0 && <div>No Tokens Minted yet</div>}
        {DiamondMintButton == true && (
          <div style={{ align: "center", padding: "2em" }}>
            You can now mint a <b>Diamond</b> Collectible:
            <Button onClick={() => mintDiamondToken({})}>Mint Diamond</Button>
          </div>
        )}
        {Displayerror.length > 0 && (
          <div style={{ backgroundColor: "red" }}>{Displayerror}</div>
        )}
      </div>
    </div>
  ) : (
    <div style={{ align: "center", padding: "2em" }}>
      <h4>Connect your Wallet to see your Collection</h4>
      <div>Kindly Connect to Binance Smart Chain (TestNet)</div>
    </div>
  );
};

export default MyCollection;
