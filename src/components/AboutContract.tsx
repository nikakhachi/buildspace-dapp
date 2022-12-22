import { Link } from "@mui/material";
import { WavesContext } from "../contexts/WavesContext";
import { useContext } from "react";

export const AboutContract = () => {
  const wavesContext = useContext(WavesContext);

  return (
    <div
      style={{
        position: "absolute",
        top: 3,
        left: 3,
        width: 200,
      }}
    >
      <Link target="_blank" href={`https://goerli.etherscan.io/address/${wavesContext?.contractAddress}`}>
        <img alt="etherscan-logo" style={{ width: "100%" }} src="https://goerli.etherscan.io/assets/svg/logos/logo-etherscan.svg?v=0.0.2" />
      </Link>
    </div>
  );
};
