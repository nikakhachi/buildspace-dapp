import { Button, TextField, Typography, Grid, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { connectWallet, findMetaMaskAccount, getSigner, metamaskWindow } from "./services/metamask.service";
import { connectToWavePortalContract } from "./services/web3.service";
import styles from "./app.module.css";
import moment from "moment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
interface Wave {
  waver: string;
  message: string;
  timestamp: number;
}

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [waves, setWaves] = useState<Wave[]>([]);
  const [message, setMessage] = useState("");
  const [isMining, setIsMining] = useState(false);

  const connectToWallet = async () => {
    try {
      const account = await connectWallet();
      setCurrentAccount(account);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAndUpdateWaves = async () => {
    const signer = getSigner();
    const wavePortalContract = connectToWavePortalContract(signer);
    const wavesRaw = await wavePortalContract.getAllWaves();
    setWaves(
      wavesRaw
        .map((item: any) => ({
          waver: item[0],
          message: item[1],
          timestamp: item[2].toNumber(),
        }))
        .sort((a: Wave, b: Wave) => b.timestamp - a.timestamp)
    );
  };

  const wave = async () => {
    try {
      if (metamaskWindow) {
        const signer = getSigner();
        const wavePortalContract = connectToWavePortalContract(signer);

        const waveTxn = await wavePortalContract.wave(message);
        setIsMining(true);

        await waveTxn.wait();

        setIsMining(false);
        setMessage("");

        await fetchAndUpdateWaves();
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
        await fetchAndUpdateWaves();
      }
    })();
  }, []);

  return (
    <div className={styles.root}>
      {!currentAccount ? (
        <div className={styles.unauthorizedDiv}>
          <Typography variant="h3" gutterBottom>
            Connect To Metamask
          </Typography>
          <Button variant="contained" onClick={connectToWallet}>
            Connect
          </Button>
        </div>
      ) : (
        <Grid container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
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
              disabled={isMining}
            />
            <Button disabled={isMining} sx={{ width: "50%" }} variant="contained" onClick={wave}>
              {isMining ? (
                <>
                  <CircularProgress sx={{ marginRight: "5px" }} color="info" size="1rem" /> Mining ⛏️
                </>
              ) : (
                "Wave 👏"
              )}
            </Button>
          </Grid>
          <Grid item xs={12} sm={10}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} size="small">
                <TableHead sx={{ background: "lightgray" }}>
                  <TableRow>
                    <TableCell>
                      <strong>Sender</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Message</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {waves.map((wave) => (
                    <TableRow key={wave.timestamp}>
                      <TableCell sx={{ background: "rgba(0,0,0,0.4)", color: "white" }} component="th" scope="row">
                        {wave.waver}
                      </TableCell>
                      <TableCell sx={{ background: "rgba(0,0,0,0)", borderRight: "1px solid rgba(0,0,0,0.1)" }} align="right">
                        {moment.unix(wave.timestamp).format("DD/MM/YYYY h:mma")}
                      </TableCell>
                      <TableCell sx={{ background: "rgba(0,0,0,0)" }} align="right">
                        {wave.message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default App;
