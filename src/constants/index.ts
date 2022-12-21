export const CONTRACT_ADDRESS = "0x82ec67fc81398b91c73064EfEed4621e336bA027";
export const CONTRACT_INTERFACE = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getTotalWaves",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "waver_address",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "date",
            type: "uint256",
          },
        ],
        internalType: "struct WavePortal.Wave[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wave",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
