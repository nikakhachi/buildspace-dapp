import { ethers } from "ethers";

// @ts-ignore
export const metamaskWindow = window.ethereum;

export const findMetaMaskAccount = async () => {
  try {
    if (!metamaskWindow) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", metamaskWindow);
    const accounts = await metamaskWindow.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getSigner = () => {
  const provider = new ethers.providers.Web3Provider(metamaskWindow);
  const signer = provider.getSigner();
  return signer;
};

export const connectWallet = async () => {
  const ethereum = metamaskWindow;
  if (!ethereum) {
    alert("Get MetaMask!");
    return null;
  }

  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });

  console.log("Connected", accounts[0]);
  return accounts[0];
};
