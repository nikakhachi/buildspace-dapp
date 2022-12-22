import { useContext, useEffect } from "react";
import { CircularProgress, Grid } from "@mui/material";
import { WalletContext } from "../contexts/WalletContext";
import { WaveTable } from "../components/WaveTable";
import { InputForm } from "../components/InputForm";
import { WavesContext } from "../contexts/WavesContext";

export const HomeView = () => {
  const walletContext = useContext(WalletContext);
  const wavesContext = useContext(WavesContext);

  useEffect(() => {
    (async () => {
      if (walletContext && wavesContext) {
        wavesContext?.fetchAndUpdateWaves(walletContext.getSigner());
        wavesContext?.setNewWaveEventHandler(walletContext.getSigner());
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
      <InputForm />
      <Grid item xs={12} sm={10}>
        {wavesContext?.areWavesLoading ? <CircularProgress size="1.5rem" /> : <WaveTable waves={wavesContext?.waves || []} />}
      </Grid>
    </Grid>
  );
};
