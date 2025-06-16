import { ethers } from 'ethers';

export interface AirdropInfo {
  totalClaimed: ethers.BigNumber;
  availableRewards: ethers.BigNumber;
  tasksCompleted: ethers.BigNumber;
}

const AIRDROP_CONTRACT_ADDRESS = process.env.REACT_APP_AIRDROP_CONTRACT_ADDRESS || '';

export const getAirdropContract = (signer: ethers.Signer) => {
  const contractABI = [
    'function getAirdropInfo(address) view returns (uint256, uint256, uint256)',
    'function claimAirdrop(string) returns (bool)',
  ];

  return new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, contractABI, signer);
}; 