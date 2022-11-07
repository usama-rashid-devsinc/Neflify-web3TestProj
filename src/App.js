import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import NavBar from "./components/Navbar/NavBar";
import DashBoard from "./components/DashBoard/DashBoard";
import NFTminting from "./components/NFTminting/NFTminting";
import MyCollection from "./components/Mycollection/MyCollection";
import StakeTokens from "./components/StakeTokens/StakeTokens";
import TokensInfo from "./components/TokensInfo/TokensInfo";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import NavBar2 from "./components/Navbar/NavBar2";
import NavBar3 from "./components/Navbar/Navbar3";

const ChainName = () => {
  console.log("Chain Name");
  return;
};

const App = () => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {}, [address]);

  return (
    <div className="background-image ">
      <div className="App">
        {/* <NavBar
          currentUser={address}
          connect={connect}
          connectors={connectors}
          disconnect={disconnect}
        ></NavBar> */}
        <NavBar2
          className="p2"
          currentUser={address}
          connect={connect}
          connectors={connectors}
          disconnect={disconnect}
        ></NavBar2>
        <NavBar3
          currentUser={address}
          connect={connect}
          connectors={connectors}
          disconnect={disconnect}
        ></NavBar3>
        <div className="blur-Backgrounds">
          <Routes>
            <Route>
              <Route
                exact
                path="/"
                element={<DashBoard currentUser={address} />}
              />
              <Route
                exact
                path="/NFTminting"
                element={<NFTminting currentUser={address} />}
              />
              <Route
                exact
                path="/myCollection"
                element={<MyCollection currentUser={address} />}
              />
              <Route
                exact
                path="/StakeTokens"
                element={<StakeTokens currentUser={address} />}
              />
              <Route
                exact
                path="/BuyTokens"
                element={<TokensInfo currentUser={address} />}
              />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
