import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_INTERFACE } from "../constants";

export const connectToWavePortalContract = (signer: ethers.Signer | ethers.providers.Provider | undefined) =>
  new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_INTERFACE, signer);
