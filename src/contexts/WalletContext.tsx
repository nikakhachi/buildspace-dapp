import { createContext, useState, PropsWithChildren, useEffect } from "react";
import { ethers } from "ethers";

type WalletContextType = {
  metamaskWallet: any;
  metamaskAccount: any;
  connectToWallet: () => void;
  isMetamaskAccountSearchLoading: boolean;
  getSigner: () => ethers.providers.JsonRpcSigner;
  checkIfNetworkIsGoerli: () => Promise<boolean>;
  isNetworkGoerli: boolean | undefined;
};

export const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // @ts-ignore
  const metamaskWallet = window.ethereum;
  const [metamaskAccount, setMetamaskAccount] = useState<any>();
  const [isMetamaskAccountSearchLoading, setIsMetamaskAccountSearchLoading] = useState(true);
  const [isNetworkGoerli, setIsNetworkGoerli] = useState<boolean>();

  useEffect(() => {
    (async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setMetamaskAccount(account);
        await checkIfNetworkIsGoerli();
        setIsMetamaskAccountSearchLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const findMetaMaskAccount = async () => {
    try {
      if (!metamaskWallet) return null;

      console.log("We have the Ethereum object", metamaskWallet);
      const accounts = await metamaskWallet.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        return account;
      } else {
        setIsMetamaskAccountSearchLoading(false);
        console.error("No authorized account found");
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const connectToWallet = async () => {
    if (!metamaskWallet) return null;

    const accounts = await metamaskWallet.request({
      method: "eth_requestAccounts",
    });

    console.log("Connected", accounts[0]);
    setMetamaskAccount(accounts[0]);
    checkIfNetworkIsGoerli();
    return accounts[0];
  };

  const getSigner = () => {
    const provider = new ethers.providers.Web3Provider(metamaskWallet);
    const signer = provider.getSigner();
    return signer;
  };

  const checkIfNetworkIsGoerli = async () => {
    const provider = new ethers.providers.Web3Provider(metamaskWallet);
    const network = await provider.getNetwork();
    if (network.name === "goerli") {
      setIsNetworkGoerli(true);
    } else {
      setIsNetworkGoerli(false);
    }
    return network.name === "goerli";
  };

  const value = {
    metamaskWallet,
    metamaskAccount,
    connectToWallet,
    isMetamaskAccountSearchLoading,
    getSigner,
    checkIfNetworkIsGoerli,
    isNetworkGoerli,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
