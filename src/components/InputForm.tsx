import React, { useContext, useState } from "react";
import { Button, TextField, Typography, Grid, CircularProgress } from "@mui/material";
import { WavesContext } from "../contexts/WavesContext";
import { WalletContext } from "../contexts/WalletContext";

interface IProps {}

export const InputForm: React.FC<IProps> = ({}) => {
  const wavesContext = useContext(WavesContext);
  const walletContext = useContext(WalletContext);
  const [message, setMessage] = useState("");

  const handleWave = async () => {
    if (walletContext) {
      await wavesContext?.handleWave(walletContext.getSigner(), message);
      setMessage("");
    }
  };

  return (
    <>
      <Typography variant="h2" gutterBottom>
        ethereum-goerli
      </Typography>
      <Grid item xs={12} sm={8} md={6} sx={{ display: "flex", gap: "1rem" }}>
        <TextField
          fullWidth
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value.substring(0, 50))}
          label="Message"
          variant="outlined"
          disabled={wavesContext?.isMining}
        />
        <Button disabled={wavesContext?.isMining} sx={{ width: "50%" }} variant="contained" onClick={handleWave}>
          {wavesContext?.isMining ? (
            <>
              <CircularProgress sx={{ marginRight: "5px" }} color="info" size="1rem" /> Mining ⛏️
            </>
          ) : (
            "Wave 👏"
          )}
        </Button>
      </Grid>
    </>
  );
};
