import { createContext, useState, PropsWithChildren } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_INTERFACE } from "../constants";
import { Wave } from "../types";

type WavesContextType = {
  isMining: boolean;
  fetchAndUpdateWaves: (signer: ethers.providers.JsonRpcSigner) => Promise<void>;
  waves: Wave[];
  handleWave: (signer: ethers.providers.JsonRpcSigner, message: string) => Promise<void>;
  setWaves: (waves: Wave[]) => void;
  setNewWaveEventHandler: (signer: ethers.providers.JsonRpcSigner) => void;
  areWavesLoading: boolean;
  contractAddress?: string;
};

export const WavesContext = createContext<WavesContextType | null>(null);

export const WavesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isMining, setIsMining] = useState(false);
  const [waves, setWaves] = useState<Wave[]>([]);
  const [areWavesLoading, setAreWavesLoading] = useState(true);
  const [wavesContract, setWavesContract] = useState<ethers.Contract>();

  const getWaveContract = (signer: ethers.Signer | ethers.providers.Provider | undefined): ethers.Contract => {
    if (wavesContract) return wavesContract;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_INTERFACE, signer);
    setWavesContract(contract);
    return contract;
  };

  const fetchAndUpdateWaves = async (signer: ethers.providers.JsonRpcSigner) => {
    setAreWavesLoading(true);
    const wavePortalContract = getWaveContract(signer);
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
    setAreWavesLoading(false);
  };

  const handleWave = async (signer: ethers.providers.JsonRpcSigner, message: string) => {
    try {
      const wavePortalContract = getWaveContract(signer);
      const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
      setIsMining(true);
      await waveTxn.wait();
      setIsMining(false);
    } catch (error) {
      console.log(error);
    }
  };

  const setNewWaveEventHandler = (signer: ethers.providers.JsonRpcSigner) => {
    const wavePortalContract = getWaveContract(signer);
    wavePortalContract.provider.once("block", () => {
      wavePortalContract.on("NewWave", (from: string, timestamp: number, message: string) => {
        console.log("NewWave", from, timestamp, message);
        setWaves((prevState) => [
          {
            waver: from,
            timestamp: timestamp,
            message,
          },
          ...prevState,
        ]);
      });
    });
  };

  const value = {
    isMining,
    fetchAndUpdateWaves: (signer: ethers.providers.JsonRpcSigner) => fetchAndUpdateWaves(signer),
    waves,
    handleWave,
    setWaves,
    setNewWaveEventHandler: (signer: ethers.providers.JsonRpcSigner) => setNewWaveEventHandler(signer),
    areWavesLoading,
    contractAddress: wavesContract?.address,
  };

  return <WavesContext.Provider value={value}>{children}</WavesContext.Provider>;
};
