import { useContext } from "react";
import styles from "./app.module.css";
import { LoadingView } from "./views/LoadingView";
import { WalletContext } from "./contexts/WalletContext";
import { NoMetamaskView } from "./views/NoMetamaskView";
import { ConnectMetamaskView } from "./views/ConnectMetamaskView";
import { InvalidNetworkView } from "./views/InvalidNetworkView";
import { HomeView } from "./views/HomeView";

const App = () => {
  const walletContext = useContext(WalletContext);

  return (
    <div className={styles.root}>
      {!walletContext?.metamaskWallet ? (
        <NoMetamaskView />
      ) : walletContext?.isMetamaskAccountSearchLoading ? (
        <LoadingView />
      ) : !walletContext?.metamaskAccount ? (
        <ConnectMetamaskView />
      ) : walletContext.isNetworkGoerli === undefined ? (
        <LoadingView />
      ) : walletContext.isNetworkGoerli === false ? (
        <InvalidNetworkView />
      ) : (
        <HomeView />
      )}
    </div>
  );
};

export default App;
