import { useContext, useEffect } from "react";
import { Grid } from "@mui/material";
import styles from "./app.module.css";
import { LoadingView } from "./views/LoadingView";
import { WalletContext } from "./contexts/WalletContext";
import { NoMetamaskView } from "./views/NoMetamaskView";
import { WaveTable } from "./components/WaveTable";
import { InputForm } from "./components/InputForm";
import { ConnectMetamaskView } from "./views/ConnectMetamaskView";
import { WavesContext } from "./contexts/WavesContext";
import { InvalidNetworkView } from "./views/InvalidNetworkView";

const App = () => {
  const walletContext = useContext(WalletContext);
  const wavesContext = useContext(WavesContext);

  useEffect(() => {
    if (walletContext?.metamaskAccount) {
      (async () => {
        const isNetworkGoerli = await walletContext.checkIfNetworkIsGoerli();
        if (isNetworkGoerli) {
          wavesContext?.fetchAndUpdateWaves(walletContext.getSigner());
          wavesContext?.setNewWaveEventHandler(walletContext.getSigner());
        }
      })();
    }
  }, [walletContext?.metamaskAccount]);

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
        <Grid container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <InputForm />
          <Grid item xs={12} sm={10}>
            <WaveTable waves={wavesContext?.waves || []} />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default App;
