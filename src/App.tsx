import { useEffect, useState } from "react";
import { connectWallet, findMetaMaskAccount, getSigner, metamaskWindow } from "./services/metamask.service";
import { connectToWavePortalContract } from "./services/web3.service";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const connectToWallet = async () => {
    try {
      const account = await connectWallet();
      setCurrentAccount(account);
    } catch (error) {
      console.error(error);
    }
  };

  const wave = async () => {
    try {
      if (metamaskWindow) {
        const signer = getSigner();
        const wavePortalContract = connectToWavePortalContract(signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count);

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setCurrentAccount(account);
      }
    })();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        {!currentAccount ? (
          <button className="waveButton" onClick={connectToWallet}>
            Connect Wallet
          </button>
        ) : (
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
