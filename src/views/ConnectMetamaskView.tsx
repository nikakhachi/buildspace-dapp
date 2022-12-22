import { Button, CircularProgress, Typography } from "@mui/material";
import { useContext } from "react";
import { WalletContext } from "../contexts/WalletContext";

export const ConnectMetamaskView = () => {
  const walletContext = useContext(WalletContext);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Connect To Metamask
      </Typography>
      <Button variant="contained" onClick={walletContext?.connectToWallet}>
        Connect
      </Button>
    </div>
  );
};
